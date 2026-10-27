import express from 'express';
import dotenv from 'dotenv';
import './config/mongo.config.js';
import novedadRouter from './routers/novedad.routers.js';

dotenv.config();

const app = express();

app.use(express.json());

app.use('/api/novedades', novedadRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});