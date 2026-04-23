const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');
const Blacklist = require('../models/TokenBlacklistModel');

const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        message: 'Token não fornecido'
      });
    }

    const isBlacklisted = await Blacklist.findOne({ token });

    if (isBlacklisted) {
      return res.status(401).json({
        message: 'Token inválido (logout)'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({
        message: 'User não encontrado'
      });
    }

    req.user = user;
    req.token = token;

    next();

  } catch (error) {
    return res.status(401).json({
      message: 'Token inválido'
    });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.roles.includes('admin')) {
    return next();
  }

  return res.status(403).json({
    message: 'Apenas admin'
  });
};

module.exports = { protect, isAdmin };