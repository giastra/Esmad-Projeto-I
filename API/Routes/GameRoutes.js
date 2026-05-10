const express = require('express');
const router = express.Router();
const gameController = require('../Controllers/GameController');
const { protect } = require('../Middlewares/authMiddleware');

router.use(protect);

router.get('/',       gameController.getMinhasPosiçoes);
router.get('/:id',    gameController.getPosicaoById);
router.post('/',      gameController.criar);
router.put('/:id',   gameController.atualizar);
router.delete('/:id', gameController.apagar);

module.exports = router;