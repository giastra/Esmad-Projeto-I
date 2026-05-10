const express = require('express');
const router = express.Router();
const propController = require('../Controllers/PropController');
const { protect, isAdmin } = require('../Middlewares/authMiddleware');
const upload = require('../Middlewares/uploadMiddleware');

router.get('/',       protect, propController.getProps);
router.get('/:id',    protect, propController.getPropById);
router.post('/',      protect, isAdmin, upload.single('img'), propController.criar);
router.put('/:id',    protect, isAdmin, upload.single('img'), propController.atualizar);
router.delete('/:id', protect, isAdmin, propController.apagar);

module.exports = router;