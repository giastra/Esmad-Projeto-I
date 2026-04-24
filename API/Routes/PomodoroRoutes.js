const express = require('express');
const router = express.Router();
const { getDefault,
     getMeus, 
     criar, 
     atualizar, 
     apagar, 
     ativar, 
     atualizarDefault } = require('../controllers/pomodoroController');

const { protect, isAdmin } = require('../middleware/authMiddleware');
 
// Público
router.get('/default', getDefault);
 
// Admin 
router.put('/admin/default', protect, isAdmin, atualizarDefault);
 
// Autenticado
router.get('/', protect, getMeus);
router.post('/', protect, criar);
router.put('/:id/ativar', protect, ativar);
router.put('/:id', protect, atualizar);
router.delete('/:id', protect, apagar);
 
module.exports = router;