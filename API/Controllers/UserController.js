const User = require('../models/UserModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Blacklist = require('../models/TokenBlacklistModel');


const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};


const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({
        success: false,
        message: 'Email já existe'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      roles: ['user']
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        roles: user.roles
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        roles: user.roles
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const logout = async (req, res) => {
  try {
    const token = req.token;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    await Blacklist.create({
      token,
      expiresAt: new Date(decoded.exp * 1000)
    });

    res.json({
      success: true,
      message: 'Logout efetuado com sucesso'
    });

  } catch (error) {
    return res.status(401).json({
      message: 'Token inválido'
    });
  }
};


const getUsers = async (req, res) => {
  const users = await User.find().select('-password');

  res.json({
    success: true,
    data: users
  });
};


const getUserById = async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (!user) {
    return res.status(404).json({
      message: 'Utilizador não encontrado'
    });
  }

  res.json({
    success: true,
    data: user
  });
};


const updateUserSelf = async (req, res) => {
  try {
    delete req.body.roles;
    delete req.body._id;

    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      req.body,
      { new: true }
    ).select('-password');

    res.json({
      success: true,
      data: user
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const deleteOwnUser = async (req, res) => {
  await User.findByIdAndDelete(req.user._id);

  res.json({
    success: true,
    message: 'Conta eliminada com sucesso'
  });
};


const updateUserRole = async (req, res) => {
  try {
    const { roles } = req.body;

    if (!Array.isArray(roles)) {
      return res.status(400).json({
        message: 'roles deve ser um array'
      });
    }

    const allowed = ['user', 'admin'];

    if (!roles.every(r => allowed.includes(r))) {
      return res.status(400).json({
        message: 'roles inválidas'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { roles },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        message: 'Utilizador não encontrado'
      });
    }

    res.json({
      success: true,
      data: user
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  register,
  login,
  logout,
  getUsers,
  getUserById,
  updateUserSelf,
  deleteOwnUser,
  updateUserRole
};