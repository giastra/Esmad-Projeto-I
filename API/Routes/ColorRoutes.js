const express = require('express');
const router = express.Router();

const {
  getColors,
  getColorById,
  createColor,
  updateColor,
  deleteColor
} = require('../controllers/ColorController');

const { protect, isAdmin } = require('../middlewares/authMiddleware');

const {validateCreateColor,validateUpdateColor,validateColorId} = require('../middlewares/colorValidation');

// Rotas públicas (leitura)
router.get('/', getColors);
router.get('/:id', validateColorId, getColorById);

// Rotas protegidas (admin only)
router.post('/', protect, isAdmin, validateCreateColor, createColor);
router.put('/:id', protect, isAdmin, validateUpdateColor, updateColor);
router.delete('/:id', protect, isAdmin, validateColorId, deleteColor);

module.exports = router;