const SkinGymManager = require('./src/skinGymManager');

async function test() {
  console.log('Testing SkinGymManager...');
  const skinGym = new SkinGymManager();
  
  try {
    // Test getting total members (should be 0 initially)
    const total = await skinGym.getTotalActiveMembers();
    console.log('Total active members:', total);
    
    // Test getting monthly data
    const monthly = await skinGym.getMonthlyNewMembers();
    console.log('Monthly data:', monthly);
    
    console.log('Basic functionality works!');
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    skinGym.close();
  }
}

test();