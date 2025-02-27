// src/backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Ensure that 'authenticatePlayer' is the function exported from 'authController'
router.post('/authenticate', authController.authenticatePlayer);

console.log('Auth routes initialized');
router.post('/register', authController.registerPlayer);



module.exports = router;

