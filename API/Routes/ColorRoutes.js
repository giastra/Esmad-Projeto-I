const express = require('express');
const router = express.Router();
const colorController = require('../Controllers/ColorController');
const { protect, isAdmin } = require('../Middlewares/authMiddleware');

router.get('/',       protect, colorController.getColors);
router.get('/:id',    protect, colorController.getColorById);
router.post('/',      protect, isAdmin, colorController.createColor);
router.put('/:id',    protect, isAdmin, colorController.updateColor);
router.delete('/:id', protect, isAdmin, colorController.deleteColor);

module.exports = router;