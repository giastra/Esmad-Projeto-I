const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config(); 

const app = express();


if (!process.env.MONGO_URI) {
  console.error("MONGO_URI não definido. Confirma teu .env!");
  process.exit(1); 
}


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB conectado!'))
  .catch(err => console.error('Erro ao conectar MongoDB:', err));


app.use(express.urlencoded({ extended: true }));
app.use(express.json());


const userRoutes = require("./Routes/UserRoutes");
app.use("/api/users", userRoutes);


app.get("/", (req, res) => {
  res.send("API da ESMAD está operacional.");
});


app.use((req, res) => {
  res.status(404).json({ message: "Rota não encontrada" });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor a correr em: http://localhost:${PORT}`);
});