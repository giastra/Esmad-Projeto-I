const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../Models/UserModel");

const saltRounds = 10;

require("dotenv").config(); 

// Gerar token
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

module.exports = {
  // registar
register: async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: "Preencha nome, email e password" });
    }

    // ✅ validar email com "@"
    if (!email.includes("@")) {
      return res.status(400).json({ message: "Email inválido (tem de conter @)" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email já registrado" });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await User.create({
      email,
      password: hashedPassword,
      name
    });

    res.status(201).json({
      message: "Utilizador registrado com sucesso",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        token: generateToken(newUser._id),
      },
    });

  } catch (error) {
    res.status(500).json({ message: "Erro no servidor", error: error.message });
  }
},
  // login
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Preencha email e password" });
      }

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Email ou password inválidos" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Email ou password inválidos" });
      }

      res.status(200).json({
        message: "Login realizado com sucesso",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          token: generateToken(user._id),
        },
      });
    } catch (error) {
      res.status(500).json({ message: "Erro no servidor", error: error.message });
    }
  },

  // update nome
  updateName: async (req, res) => {
    try {
      const userId = req.user.id;
      const { name } = req.body;

      if (!name) {
        return res.status(400).json({ message: "Nome é obrigatório" });
      }

      const user = await User.findByIdAndUpdate(
        userId,
        { name },
        { new: true }
      );

      res.status(200).json({
        message: "Nome atualizado com sucesso",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      });
    } catch (error) {
      res.status(500).json({ message: "Erro no servidor", error: error.message });
    }
  },

  // update pwd
  updatePassword: async (req, res) => {
    try {
      const userId = req.user.id;
      const { oldPassword, newPassword } = req.body;

      if (!oldPassword || !newPassword) {
        return res.status(400).json({ message: "Preencha passwords" });
      }

      const user = await User.findById(userId);

      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Password atual incorreta" });
      }

      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

      user.password = hashedPassword;
      await user.save();

      res.status(200).json({
        message: "Password atualizada com sucesso",
      });
    } catch (error) {
      res.status(500).json({ message: "Erro no servidor", error: error.message });
    }
  },

  // delete user
  deleteUser: async (req, res) => {
    try {
      const userId = req.user.id;

      await User.findByIdAndDelete(userId);

      res.status(200).json({
        message: "Utilizador eliminado com sucesso",
      });
    } catch (error) {
      res.status(500).json({ message: "Erro no servidor", error: error.message });
    }
  },
};