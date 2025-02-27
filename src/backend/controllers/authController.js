const bcrypt = require('bcryptjs');
const oracledb = require('oracledb');
const dbConfig = require('../config/dbConfig');

exports.authenticatePlayer = async function(req, res) {
  const { username, password } = req.body;

  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `SELECT username, password, displayName, icon FROM players WHERE username = :username`,
      [username],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (result.rows.length === 0) {
      return res.status(401).send('Authentication failed: user not found.');
    }

    const user = result.rows[0];
    const passwordIsValid = bcrypt.compareSync(password, user.PASSWORD);

    if (!passwordIsValid) {
      return res.status(401).send('Authentication failed: wrong password.');
    }

    // Remove the password field from the response for security
    delete user.PASSWORD;

    res.json({ success: true, user, message: 'Logged in successfully!' });
  } catch (err) {
    console.error('Error during database operation', err);
    res.status(500).send('Internal Server Error');
  } finally {
    if (connection) {
      await connection.close();
    }
  }
};

exports.registerPlayer = async (req, res) => {
  const { username, password, displayName, icon } = req.body;

  if (!username || !password || !displayName) {
    return res.status(400).send('Missing required fields');
  }

  let connection;
  try {
    const hashedPassword = bcrypt.hashSync(password, 10);

    connection = await oracledb.getConnection(dbConfig);
    await connection.execute(
      `INSERT INTO parsons.players (username, password, displayName, icon)
       VALUES (:username, :password, :displayName, :icon)`,
      [username, hashedPassword, displayName, icon || '/assets/avatars/avatar-placeholder.png'],
      { autoCommit: true }
    );

    res.status(201).send({ success: true, message: 'Registration successful' });
  } catch (err) {
    console.error('Error during registration:', err);
    res.status(500).send('Failed to register user');
  } finally {
    if (connection) {
      await connection.close();
    }
  }
};