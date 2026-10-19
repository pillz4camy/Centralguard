// Crea (si no existe) el administrador inicial:  npm run seed
import 'dotenv/config';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import conexion from './config/mongo.config.js';
import Usuario from './models/usuario.model.js';

const correo = (process.env.SEED_ADMIN_CORREO || '').trim().toLowerCase();
const clave = process.env.SEED_ADMIN_PASSWORD || '';

try {
  if (!correo || clave.length < 8) throw new Error('Define SEED_ADMIN_CORREO y SEED_ADMIN_PASSWORD (mínimo 8 caracteres) en el .env');
  await conexion();
  await Usuario.init(); // crea los índices únicos (correo, documento)
  const existe = await Usuario.findOne({ correo });
  if (existe) console.log('El administrador ya existe, no se hizo nada.');
  else {
    await Usuario.create({
      nombre: process.env.SEED_ADMIN_NOMBRE || 'Administrador',
      apellido: process.env.SEED_ADMIN_APELLIDO || 'CentralGuard',
      documento: process.env.SEED_ADMIN_DOCUMENTO || '0000000000',
      correo, contrasena: await bcrypt.hash(clave, 10), rol: 'administrador', estado_registro: 'aprobado',
    });
    console.log(`Administrador creado: ${correo}`);
  }
} catch (e) {
  console.error(e.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
