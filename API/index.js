require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

if (!process.env.MONGO_URI) {
  console.error("MONGO_URI não definido. Confirma teu .env!");
  process.exit(1);
}

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Caminho absoluto para servir ficheiros estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rotas
app.use('/api/users',           require('./Routes/UserRoutes'));
app.use('/api/pomodoro',        require('./Routes/PomodoroRoutes'));
app.use('/api/diary',           require('./Routes/DiaryRoutes'));
app.use('/api/colors',          require('./Routes/ColorRoutes'));
app.use('/api/props',           require('./Routes/PropRoutes'));
app.use('/api/game',            require('./Routes/GameRoutes'));
app.use('/api/task-categories', require('./Routes/TaskCategoryRoutes'));
app.use('/api/tasks',           require('./Routes/TaskRoutes'));

// MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB conectado!'))
  .catch(err => {
    console.error('Erro ao conectar MongoDB:', err);
    process.exit(1);
  });

// Rota base
app.get('/', (req, res) => {
  res.send('API da ESMAD está operacional.');
});

// 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Rota não encontrada.' });
});

// Erro global — também apanha erros do multer (fileFilter, limites, etc.)
app.use((err, req, res, next) => {
  console.error(err.stack);

  // Erros específicos do multer
  if (err.name === 'MulterError') {
    return res.status(400).json({ success: false, message: `Erro de upload: ${err.message}` });
  }

  // Erro do fileFilter (formato não suportado)
  if (err.message && err.message.includes('Formato de imagem')) {
    return res.status(400).json({ success: false, message: err.message });
  }

  res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor a correr em: http://localhost:${PORT}`));