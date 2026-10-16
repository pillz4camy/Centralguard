// Carga los puestos que hoy están fijos en el frontend:  npm run seed
import 'dotenv/config';
import mongoose from 'mongoose';
import conexion from './config/mongo.config.js';
import Puesto from './models/puesto.model.js';

const PUESTOS = [
  { nombre: 'Portería principal', tipo: 'Portería', vigilantes_requeridos: 2 },
  { nombre: 'Portería secundaria', tipo: 'Portería' },
  { nombre: 'Recepción', tipo: 'Recepción' },
  { nombre: 'Parqueadero', tipo: 'Parqueadero' },
  { nombre: 'Torre residencial', tipo: 'Torre' },
  { nombre: 'Zona social', tipo: 'Zona común' },
  { nombre: 'Piscina', tipo: 'Zona común' },
  { nombre: 'Ronda perimetral', tipo: 'Ronda' },
];

try {
  await conexion();
  for (const p of PUESTOS) await Puesto.updateOne({ nombre: p.nombre }, { $setOnInsert: p }, { upsert: true });
  console.log(`Seed listo: ${PUESTOS.length} puestos`);
} catch (e) {
  console.error(e.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
