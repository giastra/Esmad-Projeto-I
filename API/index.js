require('dotenv').config(); // Carrega variáveis de ambiente primeiro
const express = require('express');
const mongoose = require('mongoose');

const app = express();

// Teste rápido do .env
console.log("MONGO_URI:", process.env.MONGO_URI);

// Verificar variável de ambiente
if (!process.env.MONGO_URI) {
  console.error("MONGO_URI não definido. Confirma teu .env!");
  process.exit(1);
}

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
const userRoutes = require("./Routes/UserRoutes");
app.use("/api/users", userRoutes);

// Conexão MongoDB Atlas (Mongoose 6+ NÃO precisa de useNewUrlParser/useUnifiedTopology)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB conectado!'))
  .catch(err => {
    console.error('Erro ao conectar MongoDB:', err);
    process.exit(1);
  });

// Rota base
app.get("/", (req, res) => {
  res.send("API da ESMAD está operacional.");
});

// Middleware de erro
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Erro interno do servidor" });
});

// 404
app.use((req, res) => {
  res.status(404).json({ message: "Rota não encontrada" });
});

// Servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor a correr em: http://localhost:${PORT}`);
});