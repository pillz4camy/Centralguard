require('dotenv').config();
const mongoose = require('mongoose');

async function connectDB() {
  if (!process.env.MONGODB_URI) throw new Error('Falta MONGODB_URI en el .env');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('MongoDB conectado');
}

module.exports = { connectDB };
