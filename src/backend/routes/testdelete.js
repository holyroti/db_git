//genereer een password hash!

const bcrypt = require('bcryptjs');

let password = 'test'; // Password to hash
let displayName = 'Rohit'; // Display name of the user
let icon = '/assets/avatars/avatar1.png'; // Path to the icon
let hashedPassword = bcrypt.hashSync(password, 10); // Hash password using bcrypt

console.log('Bcrypt Hashed Password:', hashedPassword);
// Use this hash when inserting the user into the database
