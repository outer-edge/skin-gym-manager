const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@skingym.com' },
    update: {},
    create: {
      email: 'admin@skingym.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  console.log('✅ Created admin user: admin@skingym.com (password: admin123)');

  // Create staff user
  const staffPassword = await bcrypt.hash('staff123', 10);
  const staff = await prisma.user.upsert({
    where: { email: 'staff@skingym.com' },
    update: {},
    create: {
      email: 'staff@skingym.com',
      name: 'Staff Member',
      password: staffPassword,
      role: 'STAFF',
    },
  });

  console.log('✅ Created staff user: staff@skingym.com (password: staff123)');

  // Create sample products
  const products = [
    { name: 'Hydrating Serum', category: 'Skincare', price: 45.99, description: 'Deep hydrating serum with hyaluronic acid' },
    { name: 'Anti-Aging Cream', category: 'Skincare', price: 78.50, description: 'Premium anti-aging night cream' },
    { name: 'Vitamin C Cleanser', category: 'Skincare', price: 32.00, description: 'Brightening vitamin C face cleanser' },
    { name: 'Retinol Treatment', category: 'Skincare', price: 95.00, description: 'Professional strength retinol treatment' },
    { name: 'Sunscreen SPF 50', category: 'Protection', price: 28.99, description: 'Broad spectrum mineral sunscreen' },
  ];

  for (const product of products) {
    await prisma.product.create({ data: product });
  }

  console.log('✅ Created 5 sample products');

  // Create sample campaigns
  const campaigns = [
    {
      name: 'Instagram Summer Campaign',
      type: 'Instagram',
      startDate: new Date('2024-06-01'),
      budget: 5000,
      targetAudience: 'Women 25-45',
      impressions: 125000,
      clicks: 3500,
      conversions: 47,
      spend: 3200,
    },
    {
      name: 'Facebook Retargeting',
      type: 'Facebook',
      startDate: new Date('2024-07-01'),
      budget: 3000,
      targetAudience: 'Previous visitors',
      impressions: 75000,
      clicks: 2100,
      conversions: 28,
      spend: 1800,
    },
  ];

  for (const campaign of campaigns) {
    await prisma.campaign.create({ data: campaign });
  }

  console.log('✅ Created 2 marketing campaigns');

  // Create sample members
  const memberData = [
    { firstName: 'Ella', lastName: 'Lopez', email: 'ella.lopez@email.com', membershipType: 'PREMIUM' },
    { firstName: 'Sofia', lastName: 'Jones', email: 'sofia.jones@email.com', membershipType: 'VIP' },
    { firstName: 'Madison', lastName: 'Green', email: 'madison.green@email.com', membershipType: 'BASIC' },
    { firstName: 'Emma', lastName: 'Davis', email: 'emma.davis@email.com', membershipType: 'STANDARD' },
    { firstName: 'Olivia', lastName: 'Brown', email: 'olivia.brown@email.com', membershipType: 'PREMIUM' },
  ];

  const members = [];
  for (const data of memberData) {
    const member = await prisma.member.create({
      data: {
        ...data,
        phone: '555-' + Math.floor(Math.random() * 9000 + 1000),
        source: ['Instagram Ad', 'Facebook Ad', 'Referral', 'Walk-in'][Math.floor(Math.random() * 4)],
        memberships: {
          create: {
            membershipType: data.membershipType,
            startDate: new Date(),
            endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
            price: { BASIC: 49, STANDARD: 79, PREMIUM: 129, VIP: 199 }[data.membershipType],
          },
        },
      },
    });
    members.push(member);
  }

  console.log('✅ Created 5 sample members with active memberships');

  // Create some visits for the first member (Ella)
  const ella = members[0];
  const visitDates = [
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),  // 7 days ago
    new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
    new Date(Date.now() - 21 * 24 * 60 * 60 * 1000), // 21 days ago
  ];

  for (const date of visitDates) {
    await prisma.visit.create({
      data: {
        memberId: ella.id,
        visitDate: date,
        duration: 60,
        services: ['Facial Treatment', 'LED Therapy'],
      },
    });
  }

  console.log('✅ Created sample visits for Ella Lopez');

  // Create at-risk assessment for Emma
  const emma = members.find(m => m.email === 'emma.davis@email.com');
  await prisma.riskAssessment.create({
    data: {
      memberId: emma.id,
      riskScore: 75,
      daysSinceLastVisit: 45,
      daysSinceLastPurchase: 92,
      missedAppointments: 2,
      emailEngagement: 0.15,
      visitFrequencyChange: -50,
      hasUpcomingAppointment: false,
      priority: 'HIGH',
      recommendedActions: [
        'Send personalized re-engagement email',
        'Offer retention discount',
        'Schedule personal check-in call',
      ],
    },
  });

  console.log('✅ Created risk assessment for Emma Davis (at-risk member)');

  console.log('\n🎉 Database seeding completed successfully!');
  console.log('\n📝 Login Credentials:');
  console.log('   Admin: admin@skingym.com / admin123');
  console.log('   Staff: staff@skingym.com / staff123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });