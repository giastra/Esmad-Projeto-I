const Prop = require('../Models/PropModel');
const fs = require('fs');
const path = require('path');


// GET /api/props
exports.getProps = async (req, res) => {
  try {
    const props = await Prop.find().sort({ name: 1 });
    res.json({ success: true, data: props });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// GET /api/props/:id
exports.getPropById = async (req, res) => {
  try {
    const prop = await Prop.findById(req.params.id);
    if (!prop)
      return res.status(404).json({ success: false, message: 'Objeto não encontrado.' });

    res.json({ success: true, data: prop });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// POST /api/props
// ADMIN
exports.criar = async (req, res) => {
  try {
    const { name } = req.body;

    if (!req.file)
      return res.status(400).json({ success: false, message: 'Imagem obrigatória.' });

    const prop = await Prop.create({ name, img: req.file.filename });

    res.status(201).json({ success: true, data: prop });
  } catch (err) {
    if (req.file)
      fs.unlinkSync(path.join('uploads/props', req.file.filename));

    res.status(400).json({ success: false, message: err.message });
  }
};


// PUT /api/props/:id
// ADMIN
exports.atualizar = async (req, res) => {
  try {
    const prop = await Prop.findById(req.params.id);
    if (!prop)
      return res.status(404).json({ success: false, message: 'Objeto não encontrado.' });

    if (req.body.name) prop.name = req.body.name;

    if (req.file) {
      const oldPath = path.join('uploads/props', prop.img);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);

      prop.img = req.file.filename;
    }

    await prop.save();
    res.json({ success: true, data: prop });
  } catch (err) {
    if (req.file)
      fs.unlinkSync(path.join('uploads/props', req.file.filename));

    res.status(400).json({ success: false, message: err.message });
  }
};


// DELETE /api/props/:id
// ADMIN
exports.apagar = async (req, res) => {
  try {
    const prop = await Prop.findByIdAndDelete(req.params.id);
    if (!prop)
      return res.status(404).json({ success: false, message: 'Objeto não encontrado.' });

    const oldPath = path.join('uploads/props', prop.img);
    if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);

    res.json({ success: true, message: 'Objeto eliminado com sucesso.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};