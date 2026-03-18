const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../Models/UserModel");

const saltRounds = 10;

require("dotenv").config(); 

// Função para gerar o token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

module.exports = {
  register: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Preencha email e password" });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email já registrado" });
      }

      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const newUser = await User.create({
        email,
        password: hashedPassword,
      });

      res.status(201).json({
        message: "Utilizador registrado com sucesso",
        user: {
          id: newUser._id,
          email: newUser.email,
          token: generateToken(newUser._id),
        },
      });
    } catch (error) {
      res.status(500).json({ message: "Erro no servidor", error: error.message });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Email ou password inválidos" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Email ou senha inválidos" });
      }

      res.status(200).json({
        message: "Login realizado com sucesso",
        user: {
          id: user._id,
          email: user.email,
          token: generateToken(user._id),
        },
      });
    } catch (error) {
      res.status(500).json({ message: "Erro no servidor", error: error.message });
    }
  },
};