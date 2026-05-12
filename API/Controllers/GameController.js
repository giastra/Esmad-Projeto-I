const Game = require('../Models/GameModel');


// GET /api/game
exports.getMinhasPosiçoes = async (req, res) => {
  try {
    const posicoes = await Game.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.json({ success: true, data: posicoes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// GET /api/game/:id
exports.getPosicaoById = async (req, res) => {
  try {
    const posicao = await Game.findOne({ _id: req.params.id, user: req.user._id });
    if (!posicao)
      return res.status(404).json({ success: false, message: 'Posição não encontrada.' });

    res.json({ success: true, data: posicao });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// POST /api/game
exports.criar = async (req, res) => {
  try {
    const { x, y } = req.body;

    const posicao = await Game.create({
      x,
      y,
      user: req.user._id
    });

    res.status(201).json({ success: true, data: posicao });
  } catch (err) {
    if (err.code === 11000)
      return res.status(409).json({ success: false, message: 'Essa posição já está ocupada.' });

    res.status(400).json({ success: false, message: err.message });
  }
};


// PUT /api/game/:id
exports.atualizar = async (req, res) => {
  try {
    const posicao = await Game.findOne({ _id: req.params.id, user: req.user._id });
    if (!posicao)
      return res.status(404).json({ success: false, message: 'Posição não encontrada.' });

    const campos = ['x', 'y'];
    campos.forEach(c => { if (req.body[c] !== undefined) posicao[c] = req.body[c]; });

    await posicao.save();
    res.json({ success: true, data: posicao });
  } catch (err) {
    if (err.code === 11000)
      return res.status(409).json({ success: false, message: 'Essa posição já está ocupada.' });

    res.status(400).json({ success: false, message: err.message });
  }
};


// DELETE /api/game/:id
exports.apagar = async (req, res) => {
  try {
    const posicao = await Game.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!posicao)
      return res.status(404).json({ success: false, message: 'Posição não encontrada.' });

    res.json({ success: true, message: 'Posição eliminada com sucesso.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};