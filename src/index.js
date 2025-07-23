const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const SkinGymManager = require('./skinGymManager');

const app = express();
const PORT = process.env.PORT || 3000;

// For Railway deployment - setup data on first run
const dbPath = path.join(__dirname, '../data/skin-gym.db');
if (!fs.existsSync(dbPath)) {
  console.log('First run detected - populating sample data...');
  require('../populate-data.js');
}

const skinGym = new SkinGymManager();

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