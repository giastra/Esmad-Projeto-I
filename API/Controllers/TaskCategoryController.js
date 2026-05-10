const TaskCategory = require('../Models/TaskCategoryModel');


// GET /api/task-categories
exports.getMinhasCategorias = async (req, res) => {
  try {
    const categorias = await TaskCategory.find({ user: req.user._id })
      .populate('color')
      .sort({ name: 1 });

    res.json({ success: true, data: categorias });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// GET /api/task-categories/:id
exports.getCategoriaById = async (req, res) => {
  try {
    const categoria = await TaskCategory.findOne({ _id: req.params.id, user: req.user._id })
      .populate('color');

    if (!categoria)
      return res.status(404).json({ success: false, message: 'Categoria não encontrada.' });

    res.json({ success: true, data: categoria });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// POST /api/task-categories
exports.criar = async (req, res) => {
  try {
    const { name, color } = req.body;

    const categoria = await TaskCategory.create({
      name,
      color,
      user: req.user._id
    });

    res.status(201).json({ success: true, data: categoria });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};


// PUT /api/task-categories/:id
exports.atualizar = async (req, res) => {
  try {
    const categoria = await TaskCategory.findOne({ _id: req.params.id, user: req.user._id });
    if (!categoria)
      return res.status(404).json({ success: false, message: 'Categoria não encontrada.' });

    const campos = ['name', 'color'];
    campos.forEach(c => { if (req.body[c] !== undefined) categoria[c] = req.body[c]; });

    await categoria.save();
    res.json({ success: true, data: categoria });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};


// DELETE /api/task-categories/:id
exports.apagar = async (req, res) => {
  try {
    const categoria = await TaskCategory.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!categoria)
      return res.status(404).json({ success: false, message: 'Categoria não encontrada.' });

    res.json({ success: true, message: 'Categoria eliminada com sucesso.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};