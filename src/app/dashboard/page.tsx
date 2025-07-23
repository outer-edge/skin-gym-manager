"use client";

import { useState, useEffect } from "react";
import { 
  Users, 
  AlertTriangle, 
  TrendingUp, 
  DollarSign,
  Calendar,
  ShoppingBag,
  Activity,
  Target
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AtRiskMembersList } from "@/components/dashboard/at-risk-members";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { CampaignPerformance } from "@/components/dashboard/campaign-performance";
import { QuickActions } from "@/components/dashboard/quick-actions";

// Mock data - replace with API calls
const mockStats = {
  totalMembers: 573,
  activeMembers: 487,
  newMembersThisMonth: 23,
  atRiskMembers: 47,
  monthlyRevenue: 45230,
  revenueGrowth: 12.5,
  averageVisitsPerMember: 3.2,
  topCampaignROI: 4.2,
};

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(mockStats);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's your business overview.
          </p>
        </div>
        <QuickActions />
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMembers}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeMembers} active
            </p>
          </CardContent>
        </Card>

        <Card className="card-hover border-red-200 bg-red-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">At-Risk Members</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.atRiskMembers}
            </div>
            <p className="text-xs text-red-600">Requires immediate attention</p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats.monthlyRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-green-600">
              +{stats.revenueGrowth}% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Campaign ROI</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.topCampaignROI}x</div>
            <p className="text-xs text-muted-foreground">Best performing</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* At-Risk Members Alert */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                At-Risk Members Alert
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AtRiskMembersList />
            </CardContent>
          </Card>
        </div>

        {/* Campaign Performance */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Campaign Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <CampaignPerformance />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <RevenueChart />
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              New Members This Month
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.newMembersThisMonth}</div>
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm">
                <span>Facebook Ads</span>
                <span className="font-medium">12</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Instagram</span>
                <span className="font-medium">7</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Referrals</span>
                <span className="font-medium">4</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Visits/Member
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageVisitsPerMember}</div>
            <p className="text-xs text-muted-foreground mt-2">Per month</p>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>VIP Members</span>
                <span className="font-medium">5.2</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Premium</span>
                <span className="font-medium">3.8</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Basic</span>
                <span className="font-medium">2.1</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Recent Activity
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <div className="status-dot status-active"></div>
                <span>Sarah Johnson checked in</span>
                <span className="text-muted-foreground ml-auto">2m ago</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="status-dot status-critical"></div>
                <span>Emma Davis marked at-risk</span>
                <span className="text-muted-foreground ml-auto">15m ago</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="status-dot status-active"></div>
                <span>New member: Lisa Chen</span>
                <span className="text-muted-foreground ml-auto">1h ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}