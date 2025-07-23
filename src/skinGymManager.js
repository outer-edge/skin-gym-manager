const Database = require('./database');

class SkinGymManager {
  constructor() {
    this.db = new Database();
  }

  // Check membership duration/expiry
  async getMembershipStatus(clientId) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT c.name, c.email, m.membership_type, m.start_date, m.end_date, m.status,
               CASE 
                 WHEN m.end_date > datetime('now') THEN 'active'
                 ELSE 'expired'
               END as current_status,
               CAST((julianday(m.end_date) - julianday('now')) AS INTEGER) as days_remaining
        FROM clients c
        JOIN memberships m ON c.id = m.client_id
        WHERE c.id = ? AND m.status = 'active'
        ORDER BY m.end_date DESC
        LIMIT 1
      `;
      
      this.db.getDB().get(query, [clientId], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  // Get all active memberships with expiry info
  async getAllMembershipsStatus() {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT c.id, c.name, c.email, m.membership_type, m.start_date, m.end_date,
               CASE 
                 WHEN m.end_date > datetime('now') THEN 'active'
                 ELSE 'expired'
               END as current_status,
               CAST((julianday(m.end_date) - julianday('now')) AS INTEGER) as days_remaining
        FROM clients c
        JOIN memberships m ON c.id = m.client_id
        WHERE m.status = 'active'
        ORDER BY m.end_date ASC
      `;
      
      this.db.getDB().all(query, [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  // Get recent product purchases for a client
  async getRecentPurchases(clientId, days = 30) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT p.name, p.category, pu.quantity, pu.total_amount, pu.purchase_date
        FROM purchases pu
        JOIN products p ON pu.product_id = p.id
        WHERE pu.client_id = ? AND pu.purchase_date >= datetime('now', '-${days} days')
        ORDER BY pu.purchase_date DESC
      `;
      
      this.db.getDB().all(query, [clientId], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  // Get all recent purchases across all clients
  async getAllRecentPurchases(days = 30) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT c.name as client_name, c.email, p.name as product_name, p.category, 
               pu.quantity, pu.total_amount, pu.purchase_date
        FROM purchases pu
        JOIN clients c ON pu.client_id = c.id
        JOIN products p ON pu.product_id = p.id
        WHERE pu.purchase_date >= datetime('now', '-${days} days')
        ORDER BY pu.purchase_date DESC
      `;
      
      this.db.getDB().all(query, [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  // Get monthly new member count
  async getMonthlyNewMembers(year = new Date().getFullYear()) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          strftime('%m', join_date) as month,
          strftime('%Y', join_date) as year,
          COUNT(*) as new_members
        FROM clients
        WHERE strftime('%Y', join_date) = ?
        GROUP BY strftime('%Y-%m', join_date)
        ORDER BY month
      `;
      
      this.db.getDB().all(query, [year.toString()], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  // Get total active members count
  async getTotalActiveMembers() {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT COUNT(DISTINCT c.id) as total_active_members
        FROM clients c
        JOIN memberships m ON c.id = m.client_id
        WHERE c.status = 'active' AND m.status = 'active' AND m.end_date > datetime('now')
      `;
      
      this.db.getDB().get(query, [], (err, row) => {
        if (err) reject(err);
        else resolve(row.total_active_members);
      });
    });
  }

  // Add a new client
  async addClient(name, email, phone, membershipType, membershipDuration) {
    const db = this.db.getDB();
    return new Promise((resolve, reject) => {
      const clientQuery = `
        INSERT INTO clients (name, email, phone, join_date)
        VALUES (?, ?, ?, date('now'))
      `;
      
      db.run(clientQuery, [name, email, phone], function(err) {
        if (err) {
          reject(err);
          return;
        }
        
        const clientId = this.lastID;
        const membershipQuery = `
          INSERT INTO memberships (client_id, membership_type, start_date, end_date)
          VALUES (?, ?, date('now'), date('now', '+${membershipDuration} months'))
        `;
        
        db.run(membershipQuery, [clientId, membershipType], function(err) {
          if (err) reject(err);
          else resolve(clientId);
        });
      });
    });
  }

  close() {
    this.db.close();
  }
}

module.exports = SkinGymManager;