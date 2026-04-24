const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/pomodoroController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// Público
router.get('/default',           ctrl.getDefault);

// Admin
router.put('/admin/default',     protect, isAdmin, ctrl.atualizarDefault);

// Autenticado
router.get('/',                  protect, ctrl.getMeus);
router.post('/',                 protect, ctrl.criar);
router.put('/:id/ativar',        protect, ctrl.ativar);
router.put('/:id',               protect, ctrl.atualizar);
router.delete('/:id',            protect, ctrl.apagar);

module.exports = router;