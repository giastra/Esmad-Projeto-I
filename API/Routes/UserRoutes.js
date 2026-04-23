const express = require('express');
const router = express.Router();

const {
  register,
  login,
  logout,
  getUsers,
  getUserById,
  updateUserSelf,
  deleteOwnUser,
  updateUserRole
} = require('../controllers/UserController');

const { protect, isAdmin } = require('../middlewares/authMiddleware');

const {
  validateRegister,
  validateLogin,
  validateUpdateUser,
  validateUserId
} = require('../middlewares/userValidation');

// PUBLIC
router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);

// USER
router.put('/me', protect, validateUpdateUser, updateUserSelf);
router.delete('/me', protect, deleteOwnUser);
router.post('/logout', protect, logout);

// ADMIN
router.get('/', protect, isAdmin, getUsers);
router.get('/:id', protect, isAdmin, validateUserId, getUserById);

// ROLES
router.patch('/:id/roles', protect, isAdmin, updateUserRole);

module.exports = router;