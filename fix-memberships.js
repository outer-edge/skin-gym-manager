const Database = require('./src/database');

async function fixMemberships() {
  const db = new Database();
  
  // Update all memberships to be active and extend their end dates
  await new Promise((resolve, reject) => {
    db.getDB().run(`
      UPDATE memberships 
      SET end_date = date('now', '+' || 
        CASE membership_type
          WHEN 'Basic' THEN '6'
          WHEN 'Standard' THEN '12' 
          WHEN 'Premium' THEN '18'
          WHEN 'VIP' THEN '24'
          ELSE '12'
        END || ' months')
    `, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
  
  console.log('✅ Updated all memberships to be active for the next 6-24 months');
  db.close();
}

fixMemberships().catch(console.error);