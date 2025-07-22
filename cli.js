#!/usr/bin/env node

const SkinGymManager = require('./src/skinGymManager');

class SkinGymCLI {
  constructor() {
    this.manager = new SkinGymManager();
  }

  async run() {
    console.log('🏋️‍♀️ Skin Gym Client Manager CLI');
    console.log('=====================================');
    
    try {
      // Add some sample data first
      await this.addSampleData();
      
      // Display all the requested information
      await this.showDashboard();
      
    } catch (error) {
      console.error('Error:', error.message);
    } finally {
      this.manager.close();
    }
  }

  async addSampleData() {
    // Skip adding sample data since we have populated data
    console.log('\n📝 Using existing database...');
  }

  async showDashboard() {
    console.log('\n📊 SKIN GYM DASHBOARD');
    console.log('=====================');

    // 1. Total active members
    const totalMembers = await this.manager.getTotalActiveMembers();
    console.log(`\n👥 Total Active Members: ${totalMembers}`);

    // 2. Monthly new members
    const monthlyData = await this.manager.getMonthlyNewMembers();
    console.log('\n📈 New Members by Month (This Year):');
    if (monthlyData.length > 0) {
      monthlyData.forEach(item => {
        const monthName = new Date(2023, item.month - 1).toLocaleString('default', { month: 'long' });
        console.log(`   ${monthName}: ${item.new_members} new members`);
      });
    } else {
      console.log('   No new members this year');
    }

    // 3. Recent purchases
    const recentPurchases = await this.manager.getAllRecentPurchases(30);
    console.log('\n🛒 Recent Purchases (Last 30 Days):');
    if (recentPurchases.length > 0) {
      recentPurchases.slice(0, 5).forEach(purchase => {
        console.log(`   ${purchase.client_name}: ${purchase.product_name} (Qty: ${purchase.quantity}, $${purchase.total_amount})`);
      });
      if (recentPurchases.length > 5) {
        console.log(`   ... and ${recentPurchases.length - 5} more purchases`);
      }
    } else {
      console.log('   No recent purchases');
    }

    // 4. Detailed membership list
    const memberships = await this.manager.getAllMembershipsStatus();
    console.log('\n📋 All Memberships:');
    if (memberships.length > 0) {
      memberships.slice(0, 10).forEach(membership => {
        const status = membership.current_status === 'active' ? '✅' : '❌';
        const daysInfo = membership.current_status === 'active' ? 
          ` (${membership.days_remaining} days remaining)` : '';
        console.log(`   ${status} ${membership.name} - ${membership.membership_type}${daysInfo}`);
        console.log(`      Email: ${membership.email}`);
        console.log(`      End Date: ${new Date(membership.end_date).toLocaleDateString()}`);
        console.log('');
      });
      if (memberships.length > 10) {
        console.log(`   ... and ${memberships.length - 10} more memberships`);
      }
    } else {
      console.log('   No memberships found');
    }
  }
}

// Run the CLI
if (require.main === module) {
  const cli = new SkinGymCLI();
  cli.run().catch(console.error);
}

module.exports = SkinGymCLI;