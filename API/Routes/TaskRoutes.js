const express = require('express');
const router = express.Router();
const taskController = require('../Controllers/TaskController');
const { protect } = require('../Middlewares/authMiddleware');

router.use(protect);

router.get('/',       taskController.getMinhasTarefas);
router.get('/:id',    taskController.getTarefaById);
router.post('/',      taskController.criar);
router.put('/:id',    taskController.atualizar);
router.delete('/:id', taskController.apagar);

module.exports = router;