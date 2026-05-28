const express = require('express');
const router = express.Router();
const diaryController = require('../Controllers/DiaryController');
const { protect } = require('../Middlewares/authMiddleware');

router.use(protect);

router.get('/',       diaryController.getMeusDiarios);
router.get('/:id',    diaryController.getDiarioById);
router.post('/',      diaryController.criar);
router.put('/:id',    diaryController.atualizar);
router.delete('/:id', diaryController.apagar);

module.exports = router;