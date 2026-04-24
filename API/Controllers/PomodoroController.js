const Pomodoro = require('../models/PomodoroModel');
const User = require('../models/UserModel');


// GET /api/pomodoro/default
exports.getDefault = async (req, res) => {
  try {
    const pomodoro = await Pomodoro.findOne({ isDefault: true });
    if (!pomodoro)
      return res.status(404).json({ success: false, message: 'Nenhum pomodoro default definido.' });
    res.json({ success: true, data: pomodoro });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

//AUTENTICADO

// GET /api/pomodoro
// Devolve o default + os setups do próprio utilizador + qual está ativo
exports.getMeus = async (req, res) => {
  try {
    const [meus, defaultPomodoro, user] = await Promise.all([
      Pomodoro.find({ user: req.user._id, isDefault: false }),
      Pomodoro.findOne({ isDefault: true }),
      User.findById(req.user._id).select('activePomodoro')
    ]);

    res.json({
      success: true,
      data: {
        default: defaultPomodoro,
        meus,
        activePomodoro: user.activePomodoro
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/pomodoro
// Cria um novo setup
exports.criar = async (req, res) => {
  try {
    const { name, focusTime, shortBreak, longBreak, cycles } = req.body;

    const pomodoro = await Pomodoro.create({
      name,
      focusTime,
      shortBreak,
      longBreak,
      cycles,
      user: req.user._id,
      isDefault: false
    });

    res.status(201).json({ success: true, data: pomodoro });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// PUT /api/pomodoro/:id
// Atualiza um setup do próprio utilizador
exports.atualizar = async (req, res) => {
  try {
    const pomodoro = await Pomodoro.findOne({ _id: req.params.id, user: req.user._id, isDefault: false });
    if (!pomodoro)
      return res.status(404).json({ success: false, message: 'Setup não encontrado.' });

    const campos = ['name', 'focusTime', 'shortBreak', 'longBreak', 'cycles'];
    campos.forEach(c => { if (req.body[c] !== undefined) pomodoro[c] = req.body[c]; });

    await pomodoro.save();
    res.json({ success: true, data: pomodoro });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE /api/pomodoro/:id
// Apaga um setup do próprio utilizador
exports.apagar = async (req, res) => {
  try {
    const pomodoro = await Pomodoro.findOneAndDelete({ _id: req.params.id, user: req.user._id, isDefault: false });
    if (!pomodoro)
      return res.status(404).json({ success: false, message: 'Setup não encontrado.' });

    // Se era o ativo, limpa o activePomodoro do user
    await User.findOneAndUpdate(
      { _id: req.user._id, activePomodoro: req.params.id },
      { activePomodoro: null }
    );

    res.json({ success: true, message: 'Setup apagado com sucesso.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/pomodoro/:id/ativar
// Define qual setup está ativo para o utilizador (pode ser o default ou um seu)
exports.ativar = async (req, res) => {
  try {
    const pomodoro = await Pomodoro.findOne({
      _id: req.params.id,
      $or: [{ isDefault: true }, { user: req.user._id }]
    });

    if (!pomodoro)
      return res.status(404).json({ success: false, message: 'Setup não encontrado.' });

    await User.findByIdAndUpdate(req.user._id, { activePomodoro: pomodoro._id });

    res.json({ success: true, message: 'Setup ativado.', data: pomodoro });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ADMIN

// PUT /api/pomodoro/admin/default
// Altera o pomodoro default (o que os não autenticados veem)
exports.atualizarDefault = async (req, res) => {
  try {
    const { name, focusTime, shortBreak, longBreak, cycles } = req.body;

    let defaultPomodoro = await Pomodoro.findOne({ isDefault: true });

    if (defaultPomodoro) {
      Object.assign(defaultPomodoro, { name, focusTime, shortBreak, longBreak, cycles });
      await defaultPomodoro.save();
    } else {
      defaultPomodoro = await Pomodoro.create({
        name, focusTime, shortBreak, longBreak, cycles,
        user: req.user._id,
        isDefault: true
      });
    }

    res.json({ success: true, data: defaultPomodoro });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};