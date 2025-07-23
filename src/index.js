const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const SkinGymManager = require('./skinGymManager');

const app = express();
const PORT = process.env.PORT || 3000;

// Set production environment for Railway
if (process.env.RAILWAY_ENVIRONMENT) {
  process.env.NODE_ENV = 'production';
}

const skinGym = new SkinGymManager();

// Populate sample data after initialization
if (process.env.NODE_ENV === 'production' || process.env.RAILWAY_ENVIRONMENT) {
  setTimeout(async () => {
    console.log('Populating sample data for production...');
    try {
      // Add sample clients directly using the existing manager
      await skinGym.addClient('Ella Lopez', 'ella.lopez@email.com', '555-0001', 'Premium', 12);
      await skinGym.addClient('Sofia Jones', 'sofia.jones@email.com', '555-0002', 'VIP', 24);
      await skinGym.addClient('Madison Green', 'madison.green@email.com', '555-0003', 'Basic', 6);
      
      // Add 54 more to reach 57 total
      for (let i = 4; i <= 57; i++) {
        const firstName = ['Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'Oliver'][i % 6];
        const lastName = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones'][i % 5];
        await skinGym.addClient(
          `${firstName} ${lastName}`,
          `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@email.com`,
          `555-${String(i).padStart(4, '0')}`,
          ['Basic', 'Standard', 'Premium', 'VIP'][i % 4],
          [3, 6, 12, 24][i % 4]
        );
      }
      
      console.log('Sample data populated - 57 members added!');
    } catch (error) {
      console.error('Error populating data:', error);
    }
  }, 2000);
}

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// API Routes

// Get membership status for all clients
app.get('/api/memberships', async (req, res) => {
  try {
    const memberships = await skinGym.getAllMembershipsStatus();
    res.json(memberships);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get membership status for specific client
app.get('/api/memberships/:clientId', async (req, res) => {
  try {
    const membership = await skinGym.getMembershipStatus(req.params.clientId);
    res.json(membership);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get recent purchases (default 30 days)
app.get('/api/purchases/recent', async (req, res) => {
  try {
    const days = req.query.days || 30;
    const purchases = await skinGym.getAllRecentPurchases(days);
    res.json(purchases);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get recent purchases for specific client
app.get('/api/purchases/recent/:clientId', async (req, res) => {
  try {
    const days = req.query.days || 30;
    const purchases = await skinGym.getRecentPurchases(req.params.clientId, days);
    res.json(purchases);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get monthly new members
app.get('/api/analytics/monthly-new-members', async (req, res) => {
  try {
    const year = req.query.year || new Date().getFullYear();
    const data = await skinGym.getMonthlyNewMembers(year);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get total active members
app.get('/api/analytics/total-active-members', async (req, res) => {
  try {
    const count = await skinGym.getTotalActiveMembers();
    res.json({ total_active_members: count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add new client
app.post('/api/clients', async (req, res) => {
  try {
    const { name, email, phone, membershipType, membershipDuration } = req.body;
    const clientId = await skinGym.addClient(name, email, phone, membershipType, membershipDuration);
    res.json({ clientId, message: 'Client added successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => {
  console.log(`Skin Gym Manager server running on port ${PORT}`);
});

process.on('SIGINT', () => {
  skinGym.close();
  process.exit();
});