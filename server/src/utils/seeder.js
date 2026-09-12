const fs = require('fs');
const path = require('path');
const db = require('../config/db');

async function runSeed() {
  try {
    const sqlPath = path.join(__dirname, '../../database.sql');
    if (!fs.existsSync(sqlPath)) {
      console.log('[Seeder] database.sql not found, skipping seeder.');
      return;
    }

    // Check if tables already exist
    const [tables] = await db.query('SHOW TABLES LIKE "users"');
    if (tables.length > 0) {
      console.log('[Seeder] Database tables already exist. Skipping seed execution.');
      return;
    }

    console.log('[Seeder] Initializing database schema and default seeds from database.sql...');
    const sql = fs.readFileSync(sqlPath, 'utf-8');
    
    // Split queries by semicolon (excluding delimiters)
    const statements = sql
      .replace(/--.*$/gm, '')
      .replace(/\/\*[\s\S]*?\*\//gm, '')
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);

    for (const statement of statements) {
      await db.query(statement);
    }

    console.log('[Seeder] Database initialized and default data seeded successfully!');
  } catch (err) {
    console.error(`[Seeder] Seed execution note: ${err.message}`);
  }
}

module.exports = { runSeed };
