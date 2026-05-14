const User = require('../Models/UserModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Blacklist = require('../Models/TokenBlacklistModel');


const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};


// POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(409).json({ success: false, message: 'Email já existe.' });

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
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ success: false, message: 'Credenciais inválidas.' });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(401).json({ success: false, message: 'Credenciais inválidas.' });

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        roles: user.roles
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// POST /api/auth/logout
exports.logout = async (req, res) => {
  try {
    const token = req.token;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    await Blacklist.create({
      token,
      expiresAt: new Date(decoded.exp * 1000)
    });

    res.json({ success: true, message: 'Logout efetuado com sucesso.' });
  } catch (err) {
    res.status(401).json({ success: false, message: 'Token inválido.' });
  }
};


// GET /api/users
// ADMIN
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// GET /api/users/:id
// ADMIN
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user)
      return res.status(404).json({ success: false, message: 'Utilizador não encontrado.' });

    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// PUT /api/users/me
exports.updateUserSelf = async (req, res) => {
  try {
    delete req.body.roles;
    delete req.body._id;
    delete req.body.email;

    if (req.body.password)
      req.body.password = await bcrypt.hash(req.body.password, 10);

    const user = await User.findByIdAndUpdate(
      req.user._id,
      req.body,
      { new: true }
    ).select('-password');

    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// PUT /api/users/me/email
exports.updateEmail = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Email e password são obrigatórios.' });

    const user = await User.findById(req.user._id);
    if (!user)
      return res.status(404).json({ success: false, message: 'Utilizador não encontrado.' });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(401).json({ success: false, message: 'Password incorreta.' });

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(409).json({ success: false, message: 'Email já está em uso.' });

    user.email = email;
    await user.save();

    res.json({ success: true, message: 'Email atualizado com sucesso.', data: { email: user.email } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
// PUT /api/users/me/password
exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword)
      return res.status(400).json({ success: false, message: 'Password atual e nova password são obrigatórias.' });

    const user = await User.findById(req.user._id);

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match)
      return res.status(401).json({ success: false, message: 'Password atual incorreta.' });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ success: true, message: 'Password atualizada com sucesso.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/users/me
exports.deleteOwnUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    res.json({ success: true, message: 'Conta eliminada com sucesso.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// PUT /api/users/:id/roles
// ADMIN
exports.updateUserRole = async (req, res) => {
  try {
    const { roles } = req.body;

    if (!Array.isArray(roles))
      return res.status(400).json({ success: false, message: 'roles deve ser um array.' });

    const allowed = ['user', 'admin'];
    if (!roles.every(r => allowed.includes(r)))
      return res.status(400).json({ success: false, message: 'roles inválidas.' });

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { roles },
      { new: true }
    ).select('-password');

    if (!user)
      return res.status(404).json({ success: false, message: 'Utilizador não encontrado.' });

    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};