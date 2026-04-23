const express = require('express');
const router = express.Router();

const {register,login,getUsers,getUserById,updateUser,deleteUser} = require('../controllers/userController');

const { protect, isAdmin } = require('../middlewares/authMiddleware');

const {validateRegister,validateLogin,validateUpdateUser,validateUserId} = require('../middlewares/userValidation');

// Rotas públicas
router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);

// Rotas protegidas (admin only)
router.get('/', protect, isAdmin, getUsers);
router.get('/:id', protect, isAdmin, validateUserId, getUserById);
router.put('/:id', protect, isAdmin, validateUpdateUser, updateUser);
router.delete('/:id', protect, isAdmin, validateUserId, deleteUser);

module.exports = router;