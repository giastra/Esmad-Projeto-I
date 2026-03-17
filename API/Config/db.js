const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Ligado à base de dados MongoDB!");
  } catch (error) {
    console.error("Erro ao ligar à base de dados:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;