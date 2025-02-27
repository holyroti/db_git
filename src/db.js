const mysql = require('mysql2');

// Create the connection pool
const pool = mysql.createPool({
  host: 'localhost', // Change this if hosted elsewhere
  user: 'root', // Replace with your MySQL username
  password: 'pr0Kofj@V599', // Replace with your MySQL password
  database: 'parsons', // Replace with your database name
  port: 3300, // The port you used for MySQL
  connectionLimit: 100, // Optional: limits the number of connections in the pool
});

// Export the pool for use in other files
module.exports = pool.promise();
