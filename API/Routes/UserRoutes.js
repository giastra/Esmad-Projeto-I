const express = require('express');
const router = express.Router();
const userController = require('../Controllers/UserController');
const { protect, isAdmin } = require('../Middlewares/authMiddleware');

router.post('/register', userController.register);
router.post('/login',    userController.login);
router.post('/logout',   protect, userController.logout);

router.get('/me',           protect, userController.updateUserSelf);
router.put('/me',           protect, userController.updateUserSelf);
router.put('/me/email',     protect, userController.updateEmail);
router.delete('/me',        protect, userController.deleteOwnUser);

router.get('/',             protect, isAdmin, userController.getUsers);
router.get('/:id',          protect, isAdmin, userController.getUserById);
router.put('/:id/roles',    protect, isAdmin, userController.updateUserRole);

module.exports = router;