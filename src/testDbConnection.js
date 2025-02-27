const db = require('./db'); // Import the database connection

async function testConnection() {
  try {
    const [rows] = await db.query('SELECT 1 + 1 AS solution');
    console.log('Database connection successful:', rows);
  } catch (error) {
    console.error('Database connection failed:', error);
  }
}

testConnection();
