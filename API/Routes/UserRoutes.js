const express = require('express');
const router = express.Router();
const authController = require('../Controllers/UserController');
const authMiddleware = require('../Middlewares/authMiddleware');

// Públicas
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protegidas 
router.put('/name', authMiddleware, authController.updateName);
router.put('/password', authMiddleware, authController.updatePassword);
router.delete('/', authMiddleware, authController.deleteUser);

module.exports = router;