const express = require('express');
const router = express.Router();
const taskCategoryController = require('../Controllers/TaskCategoryController');
const { protect } = require('../Middlewares/authMiddleware');

router.use(protect);

router.get('/',       taskCategoryController.getMinhasCategorias);
router.get('/:id',    taskCategoryController.getCategoriaById);
router.post('/',      taskCategoryController.criar);
router.put('/:id',    taskCategoryController.atualizar);
router.delete('/:id', taskCategoryController.apagar);

module.exports = router;