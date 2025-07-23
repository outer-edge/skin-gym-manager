import { PrismaClient } from "@prisma/client";
import { differenceInDays, subMonths, subDays } from "date-fns";

const prisma = new PrismaClient();

export interface RiskFactors {
  daysSinceLastVisit: number;
  daysSinceLastPurchase: number;
  missedAppointments: number;
  hasUpcomingAppointment: boolean;
  visitFrequencyChange: number;
  emailEngagement: number;
  paymentIssues: number;
  membershipDaysRemaining: number | null;
}

export interface RiskAssessmentResult {
  memberId: string;
  riskScore: number;
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  factors: RiskFactors;
  recommendedActions: string[];
}

export async function assessMemberRisk(memberId: string): Promise<RiskAssessmentResult> {
  const member = await prisma.member.findUnique({
    where: { id: memberId },
    include: {
      visits: {
        orderBy: { visitDate: "desc" },
        take: 10,
      },
      purchases: {
        orderBy: { purchaseDate: "desc" },
        take: 1,
      },
      appointments: {
        where: {
          scheduledDate: { gte: new Date() },
          status: { in: ["SCHEDULED", "CONFIRMED"] },
        },
      },
      memberships: {
        where: { status: "ACTIVE" },
        orderBy: { endDate: "desc" },
        take: 1,
      },
      communications: {
        where: {
          type: "EMAIL",
          sentAt: { gte: subMonths(new Date(), 3) },
        },
      },
    },
  });

  if (!member) {
    throw new Error("Member not found");
  }

  // Calculate risk factors
  const lastVisit = member.visits[0]?.visitDate || member.joinDate;
  const daysSinceLastVisit = differenceInDays(new Date(), lastVisit);

  const lastPurchase = member.purchases[0]?.purchaseDate || member.joinDate;
  const daysSinceLastPurchase = differenceInDays(new Date(), lastPurchase);

  const hasUpcomingAppointment = member.appointments.length > 0;

  // Calculate missed appointments in last 90 days
  const missedAppointments = await prisma.appointment.count({
    where: {
      memberId,
      status: "NO_SHOW",
      scheduledDate: { gte: subDays(new Date(), 90) },
    },
  });

  // Calculate visit frequency change
  const visitFrequencyChange = calculateVisitFrequencyChange(member.visits);

  // Calculate email engagement
  const emailEngagement = calculateEmailEngagement(member.communications);

  // Check payment issues
  const paymentIssues = 0; // TODO: Implement payment tracking

  // Check membership expiry
  const activeMembership = member.memberships[0];
  const membershipDaysRemaining = activeMembership
    ? differenceInDays(new Date(activeMembership.endDate), new Date())
    : null;

  const factors: RiskFactors = {
    daysSinceLastVisit,
    daysSinceLastPurchase,
    missedAppointments,
    hasUpcomingAppointment,
    visitFrequencyChange,
    emailEngagement,
    paymentIssues,
    membershipDaysRemaining,
  };

  // Calculate risk score (0-100)
  const riskScore = calculateRiskScore(factors);
  const riskLevel = getRiskLevel(riskScore);
  const recommendedActions = getRecommendedActions(factors, riskLevel);

  // Save assessment
  await prisma.riskAssessment.create({
    data: {
      memberId,
      riskScore,
      priority: riskLevel,
      daysSinceLastVisit,
      daysSinceLastPurchase,
      missedAppointments,
      emailEngagement,
      visitFrequencyChange,
      hasUpcomingAppointment,
      paymentIssues,
      recommendedActions,
    },
  });

  return {
    memberId,
    riskScore,
    riskLevel,
    factors,
    recommendedActions,
  };
}

function calculateRiskScore(factors: RiskFactors): number {
  let score = 0;

  // No visit for 1+ month (max 30 points)
  if (factors.daysSinceLastVisit > 60) {
    score += 30;
  } else if (factors.daysSinceLastVisit > 30) {
    score += 20;
  } else if (factors.daysSinceLastVisit > 14) {
    score += 10;
  }

  // No purchase in 3+ months (max 25 points)
  if (factors.daysSinceLastPurchase > 180) {
    score += 25;
  } else if (factors.daysSinceLastPurchase > 90) {
    score += 20;
  } else if (factors.daysSinceLastPurchase > 60) {
    score += 10;
  }

  // No upcoming appointments (15 points)
  if (!factors.hasUpcomingAppointment) {
    score += 15;
  }

  // Missed appointments (max 10 points)
  score += Math.min(factors.missedAppointments * 5, 10);

  // Declining visit frequency (max 10 points)
  if (factors.visitFrequencyChange < -50) {
    score += 10;
  } else if (factors.visitFrequencyChange < -25) {
    score += 5;
  }

  // Low email engagement (max 5 points)
  if (factors.emailEngagement < 0.1) {
    score += 5;
  } else if (factors.emailEngagement < 0.3) {
    score += 3;
  }

  // Membership expiring soon (5 points)
  if (factors.membershipDaysRemaining !== null && factors.membershipDaysRemaining < 30) {
    score += 5;
  }

  return Math.min(score, 100);
}

function getRiskLevel(score: number): "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" {
  if (score >= 70) return "CRITICAL";
  if (score >= 50) return "HIGH";
  if (score >= 30) return "MEDIUM";
  return "LOW";
}

function calculateVisitFrequencyChange(visits: any[]): number {
  if (visits.length < 4) return 0;

  // Compare recent 3 months vs previous 3 months
  const threeMonthsAgo = subMonths(new Date(), 3);
  const sixMonthsAgo = subMonths(new Date(), 6);

  const recentVisits = visits.filter(
    (v) => new Date(v.visitDate) > threeMonthsAgo
  ).length;

  const previousVisits = visits.filter(
    (v) =>
      new Date(v.visitDate) > sixMonthsAgo &&
      new Date(v.visitDate) <= threeMonthsAgo
  ).length;

  if (previousVisits === 0) return 0;

  return ((recentVisits - previousVisits) / previousVisits) * 100;
}

function calculateEmailEngagement(communications: any[]): number {
  if (communications.length === 0) return 0;

  const opened = communications.filter((c) => c.openedAt).length;
  return opened / communications.length;
}

function getRecommendedActions(
  factors: RiskFactors,
  riskLevel: string
): string[] {
  const actions: string[] = [];

  if (riskLevel === "CRITICAL") {
    actions.push("Immediate personal outreach required");
    actions.push("Offer exclusive retention discount");
  }

  if (factors.daysSinceLastVisit > 30) {
    actions.push("Send personalized re-engagement email");
    actions.push("Call to schedule complimentary consultation");
  }

  if (factors.daysSinceLastPurchase > 90) {
    actions.push("Send product recommendations based on purchase history");
    actions.push("Offer limited-time product bundle discount");
  }

  if (!factors.hasUpcomingAppointment) {
    actions.push("Remind to book next appointment");
    actions.push("Offer priority booking for popular time slots");
  }

  if (factors.missedAppointments > 0) {
    actions.push("Follow up on missed appointments");
    actions.push("Offer flexible rescheduling options");
  }

  if (factors.membershipDaysRemaining !== null && factors.membershipDaysRemaining < 30) {
    actions.push("Send membership renewal reminder");
    actions.push("Offer early renewal incentive");
  }

  return actions;
}

// Batch assessment for all members
export async function assessAllMembers() {
  const members = await prisma.member.findMany({
    where: { status: "ACTIVE" },
    select: { id: true },
  });

  const results = await Promise.all(
    members.map((member) => assessMemberRisk(member.id))
  );

  // Update daily metrics
  const atRiskCount = results.filter(
    (r) => r.riskLevel === "HIGH" || r.riskLevel === "CRITICAL"
  ).length;

  const criticalCount = results.filter(
    (r) => r.riskLevel === "CRITICAL"
  ).length;

  await prisma.dailyMetrics.upsert({
    where: { date: new Date(new Date().toDateString()) },
    update: {
      atRiskMembers: atRiskCount,
      criticalRiskMembers: criticalCount,
    },
    create: {
      date: new Date(new Date().toDateString()),
      totalMembers: members.length,
      activeMembers: members.length,
      newMembers: 0,
      churnedMembers: 0,
      totalRevenue: 0,
      productRevenue: 0,
      membershipRevenue: 0,
      totalVisits: 0,
      uniqueVisitors: 0,
      avgVisitDuration: 0,
      atRiskMembers: atRiskCount,
      criticalRiskMembers: criticalCount,
    },
  });

  return results;
}