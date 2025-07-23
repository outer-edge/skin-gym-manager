const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class Database {
  constructor() {
    this.db = new sqlite3.Database(path.join(__dirname, '../data/skin-gym.db'));
    this.init();
  }

  init() {
    this.db.serialize(() => {
      // Clients table
      this.db.run(`
        CREATE TABLE IF NOT EXISTS clients (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          phone TEXT,
          join_date DATE NOT NULL,
          status TEXT DEFAULT 'active'
        )
      `);

      // Memberships table
      this.db.run(`
        CREATE TABLE IF NOT EXISTS memberships (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          client_id INTEGER NOT NULL,
          membership_type TEXT NOT NULL,
          start_date DATE NOT NULL,
          end_date DATE NOT NULL,
          status TEXT DEFAULT 'active',
          FOREIGN KEY (client_id) REFERENCES clients (id)
        )
      `);

      // Products table
      this.db.run(`
        CREATE TABLE IF NOT EXISTS products (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          price DECIMAL(10,2) NOT NULL,
          category TEXT,
          description TEXT
        )
      `);

      // Purchases table
      this.db.run(`
        CREATE TABLE IF NOT EXISTS purchases (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          client_id INTEGER NOT NULL,
          product_id INTEGER NOT NULL,
          quantity INTEGER DEFAULT 1,
          total_amount DECIMAL(10,2) NOT NULL,
          purchase_date DATE NOT NULL,
          FOREIGN KEY (client_id) REFERENCES clients (id),
          FOREIGN KEY (product_id) REFERENCES products (id)
        )
      `);
    });
  }

  getDB() {
    return this.db;
  }

  close() {
    this.db.close();
  }
}

module.exports = Database;