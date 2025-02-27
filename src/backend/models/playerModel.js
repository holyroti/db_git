// /src/backend/models/playerModel.js
const oracledb = require('oracledb');
const dbConfig = require('../config/dbConfig'); // Make sure you have a dbConfig file

async function findPlayerByUsername(username) {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `SELECT playerID, username, password, displayName, icon FROM players WHERE username = :username`,
      [username],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    return result.rows[0];
  } catch (err) {
    console.error('Database error in findPlayerByUsername:', err);
    throw err;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing connection in findPlayerByUsername:', err);
      }
    }
  }
}

module.exports = {
  findPlayerByUsername
};
