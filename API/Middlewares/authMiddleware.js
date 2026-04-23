const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verifica se o token JWT é válido e injeta req.user
const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Acesso negado. Token não fornecido'
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Utilizador não encontrado'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token inválido ou expirado'
    });
  }
};

// Verifica se o utilizador autenticado tem Admin: true
const isAdmin = (req, res, next) => {
  if (req.user && req.user.Admin === true) {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: 'Acesso negado. Apenas administradores podem realizar esta ação'
  });
};

module.exports = { protect, isAdmin };