const Color = require('../Models/ColorModel');


// GET /api/colors
exports.getColors = async (req, res) => {
  try {
    const colors = await Color.find().sort({ name: 1 });
    res.json({ success: true, data: colors });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// GET /api/colors/:id
exports.getColorById = async (req, res) => {
  try {
    const color = await Color.findById(req.params.id);
    if (!color)
      return res.status(404).json({ success: false, message: 'Cor não encontrada.' });

    res.json({ success: true, data: color });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// POST /api/colors
// ADMIN
exports.createColor = async (req, res) => {
  try {
    const color = await Color.create(req.body);
    res.status(201).json({ success: true, data: color });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    if (err.code === 11000)
      return res.status(409).json({ success: false, message: 'Já existe uma cor com esse valor.' });

    res.status(500).json({ success: false, message: err.message });
  }
};


// PUT /api/colors/:id
// ADMIN
exports.updateColor = async (req, res) => {
  try {
    const color = await Color.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!color)
      return res.status(404).json({ success: false, message: 'Cor não encontrada.' });

    res.json({ success: true, data: color });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};


// DELETE /api/colors/:id
// ADMIN
exports.deleteColor = async (req, res) => {
  try {
    const color = await Color.findByIdAndDelete(req.params.id);
    if (!color)
      return res.status(404).json({ success: false, message: 'Cor não encontrada.' });

    res.json({ success: true, message: 'Cor eliminada com sucesso.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};