const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Login
router.get('/login', authController.formLogin);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

module.exports = router;