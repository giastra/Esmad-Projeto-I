const express = require('express');
const router = express.Router();
const pomodoroController = require('../Controllers/PomodoroController');
const { protect, isAdmin } = require('../Middlewares/authMiddleware');

router.get('/default', pomodoroController.getDefault);

router.get('/',        protect, pomodoroController.getMeus);
router.post('/',       protect, pomodoroController.criar);
router.put('/:id',     protect, pomodoroController.atualizar);
router.delete('/:id',  protect, pomodoroController.apagar);
router.put('/:id/ativar', protect, pomodoroController.ativar);

router.put('/admin/default', protect, isAdmin, pomodoroController.atualizarDefault);

module.exports = router;