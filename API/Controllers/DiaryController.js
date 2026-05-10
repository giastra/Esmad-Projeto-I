const Diary = require('../Models/DiaryModel');
const { normalizeDate } = require('../utils/dateUtils');


// GET /api/diary
exports.getMeusDiarios = async (req, res) => {
  try {
    const diarios = await Diary.find({ user: req.user._id })
      .sort({ eventDate: -1 });

    res.json({ success: true, data: diarios });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// GET /api/diary/:id
exports.getDiarioById = async (req, res) => {
  try {
    const diario = await Diary.findOne({ _id: req.params.id, user: req.user._id });
    if (!diario)
      return res.status(404).json({ success: false, message: 'Entrada não encontrada.' });

    res.json({ success: true, data: diario });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// POST /api/diary
exports.criar = async (req, res) => {
  try {
    const { title, note, eventDate } = req.body;

    const diario = await Diary.create({
      title,
      note,
      eventDate: normalizeDate(eventDate),
      user: req.user._id
    });

    res.status(201).json({ success: true, data: diario });
  } catch (err) {
    if (err.code === 11000)
      return res.status(409).json({ success: false, message: 'Já existe uma entrada para essa data.' });

    res.status(400).json({ success: false, message: err.message });
  }
};


// PUT /api/diary/:id
exports.atualizar = async (req, res) => {
  try {
    const diario = await Diary.findOne({ _id: req.params.id, user: req.user._id });
    if (!diario)
      return res.status(404).json({ success: false, message: 'Entrada não encontrada.' });

    const campos = ['title', 'note'];
    campos.forEach(c => { if (req.body[c] !== undefined) diario[c] = req.body[c]; });

    if (req.body.eventDate)
      diario.eventDate = normalizeDate(req.body.eventDate);

    await diario.save();
    res.json({ success: true, data: diario });
  } catch (err) {
    if (err.code === 11000)
      return res.status(409).json({ success: false, message: 'Já existe uma entrada para essa data.' });

    res.status(400).json({ success: false, message: err.message });
  }
};


// DELETE /api/diary/:id
exports.apagar = async (req, res) => {
  try {
    const diario = await Diary.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!diario)
      return res.status(404).json({ success: false, message: 'Entrada não encontrada.' });

    res.json({ success: true, message: 'Entrada eliminada com sucesso.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};