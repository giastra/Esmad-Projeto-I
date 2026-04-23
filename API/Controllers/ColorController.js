const Color = require('../models/ColorModel');


const getColors = async (req, res) => {
  try {
    const colors = await Color.find().sort({ name: 1 });
    res.status(200).json({
      success: true,
      count: colors.length,
      data: colors
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar cores',
      error: error.message
    });
  }
};


const getColorById = async (req, res) => {
  try {
    const color = await Color.findById(req.params.id);

    if (!color) {
      return res.status(404).json({
        success: false,
        message: 'Cor não encontrada'
      });
    }

    res.status(200).json({
      success: true,
      data: color
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar cor',
      error: error.message
    });
  }
};


const createColor = async (req, res) => {
  try {
    const color = await Color.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Cor criada com sucesso',
      data: color
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({
        success: false,
        message: 'Erro de validação',
        errors: messages
      });
    }

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Já existe uma cor com esse valor'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erro ao criar cor',
      error: error.message
    });
  }
};

const updateColor = async (req, res) => {
  try {
    const color = await Color.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!color) {
      return res.status(404).json({
        success: false,
        message: 'Cor não encontrada'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Cor atualizada com sucesso',
      data: color
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({
        success: false,
        message: 'Erro de validação',
        errors: messages
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar cor',
      error: error.message
    });
  }
};

const deleteColor = async (req, res) => {
  try {
    const color = await Color.findByIdAndDelete(req.params.id);

    if (!color) {
      return res.status(404).json({
        success: false,
        message: 'Cor não encontrada'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Cor eliminada com sucesso'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao eliminar cor',
      error: error.message
    });
  }
};

module.exports = {
  getColors,
  getColorById,
  createColor,
  updateColor,
  deleteColor
};