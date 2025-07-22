const SkinGymManager = require('./src/skinGymManager');
const Database = require('./src/database');

async function populateData() {
  console.log('🔄 Populating database with sample data...');
  
  const manager = new SkinGymManager();
  const db = manager.db.getDB();
  
  try {
    // Clear existing data
    await new Promise((resolve, reject) => {
      db.run('DELETE FROM purchases', (err) => err ? reject(err) : resolve());
    });
    await new Promise((resolve, reject) => {
      db.run('DELETE FROM memberships', (err) => err ? reject(err) : resolve());
    });
    await new Promise((resolve, reject) => {
      db.run('DELETE FROM clients', (err) => err ? reject(err) : resolve());
    });
    await new Promise((resolve, reject) => {
      db.run('DELETE FROM products', (err) => err ? reject(err) : resolve());
    });

    // Add products first
    const products = [
      ['Hydrating Serum', 45.99, 'Skincare', 'Deep hydrating serum with hyaluronic acid'],
      ['Anti-Aging Cream', 78.50, 'Skincare', 'Premium anti-aging night cream'],
      ['Vitamin C Cleanser', 32.00, 'Skincare', 'Brightening vitamin C face cleanser'],
      ['Retinol Treatment', 95.00, 'Skincare', 'Professional strength retinol treatment'],
      ['Sunscreen SPF 50', 28.99, 'Protection', 'Broad spectrum mineral sunscreen'],
      ['Exfoliating Mask', 42.00, 'Treatment', 'Weekly exfoliating treatment mask'],
      ['Eye Cream', 65.00, 'Skincare', 'Intensive eye contour cream'],
      ['Toner', 25.50, 'Skincare', 'Balancing pH toner with rose water']
    ];

    for (const [name, price, category, description] of products) {
      await new Promise((resolve, reject) => {
        db.run('INSERT INTO products (name, price, category, description) VALUES (?, ?, ?, ?)', 
               [name, price, category, description], (err) => err ? reject(err) : resolve());
      });
    }

    // Generate 57 clients with varied join dates
    const firstNames = ['Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'Oliver', 'Sophia', 'Elijah', 'Charlotte', 'William', 'Amelia', 'James', 'Isabella', 'Benjamin', 'Mia', 'Lucas', 'Harper', 'Henry', 'Evelyn', 'Alexander', 'Abigail', 'Mason', 'Emily', 'Michael', 'Elizabeth', 'Ethan', 'Mila', 'Daniel', 'Ella', 'Jacob', 'Avery', 'Logan', 'Sofia', 'Jackson', 'Camila', 'Levi', 'Aria', 'Sebastian', 'Scarlett', 'Mateo', 'Victoria', 'Jack', 'Madison', 'Owen', 'Luna', 'Theodore', 'Grace', 'Aiden', 'Chloe', 'Samuel', 'Penelope', 'Joseph', 'Layla', 'John', 'Riley', 'David', 'Zoey'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts'];
    const membershipTypes = ['Basic', 'Premium', 'VIP', 'Standard'];
    
    // Create join dates spread across the year (with 0 for current month)
    const clientsData = [];
    for (let i = 0; i < 57; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const name = `${firstName} ${lastName}`;
      const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`;
      const phone = `555-${String(Math.floor(Math.random() * 9000) + 1000)}`;
      
      // Generate join dates - avoid current month (July) to make new members this month = 0
      let month;
      do {
        month = Math.floor(Math.random() * 12) + 1;
      } while (month === 7); // Avoid July
      
      const day = Math.floor(Math.random() * 28) + 1;
      const joinDate = `2025-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      
      const membershipType = membershipTypes[Math.floor(Math.random() * membershipTypes.length)];
      const membershipDuration = [3, 6, 12, 24][Math.floor(Math.random() * 4)];
      
      clientsData.push([name, email, phone, joinDate, membershipType, membershipDuration]);
    }

    // Insert clients and memberships
    for (const [name, email, phone, joinDate, membershipType, membershipDuration] of clientsData) {
      const clientId = await new Promise((resolve, reject) => {
        db.run('INSERT INTO clients (name, email, phone, join_date) VALUES (?, ?, ?, ?)', 
               [name, email, phone, joinDate], function(err) {
          if (err) reject(err);
          else resolve(this.lastID);
        });
      });

      await new Promise((resolve, reject) => {
        db.run(`INSERT INTO memberships (client_id, membership_type, start_date, end_date) 
                VALUES (?, ?, ?, date(?, '+${membershipDuration} months'))`, 
               [clientId, membershipType, joinDate, joinDate], (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    }

    // Add purchases for Ella Bash and some other clients
    const purchaseData = [
      // Ella Bash purchases
      [29, 1, 2, 91.98, '2025-07-15'], // Hydrating Serum x2
      [29, 3, 1, 32.00, '2025-07-10'], // Vitamin C Cleanser
      [29, 7, 1, 65.00, '2025-07-08'], // Eye Cream
      [29, 5, 1, 28.99, '2025-07-05'], // Sunscreen SPF 50
      
      // Other recent purchases
      [12, 2, 1, 78.50, '2025-07-18'], // Anti-Aging Cream
      [34, 4, 1, 95.00, '2025-07-16'], // Retinol Treatment
      [5, 6, 1, 42.00, '2025-07-14'], // Exfoliating Mask
      [18, 1, 3, 137.97, '2025-07-12'], // Hydrating Serum x3
      [45, 8, 2, 51.00, '2025-07-11'], // Toner x2
      [23, 3, 1, 32.00, '2025-07-09'], // Vitamin C Cleanser
      [7, 2, 1, 78.50, '2025-07-07'], // Anti-Aging Cream
      [51, 5, 2, 57.98, '2025-07-06'], // Sunscreen SPF 50 x2
    ];

    for (const [clientId, productId, quantity, totalAmount, purchaseDate] of purchaseData) {
      await new Promise((resolve, reject) => {
        db.run('INSERT INTO purchases (client_id, product_id, quantity, total_amount, purchase_date) VALUES (?, ?, ?, ?, ?)', 
               [clientId, productId, quantity, totalAmount, purchaseDate], (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    }

    console.log('✅ Database populated successfully!');
    console.log('📊 Data summary:');
    console.log('   - 57 active members');
    console.log('   - 0 new members this month (July)');
    console.log('   - 8 different skincare products');
    console.log('   - Recent purchases including Ella Bash');
    console.log('   - Members joined throughout the year');

  } catch (error) {
    console.error('❌ Error populating data:', error.message);
  } finally {
    manager.close();
  }
}

if (require.main === module) {
  populateData();
}

module.exports = populateData;