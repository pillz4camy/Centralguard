// Crea los roles, un administrador y un par de equipos de prueba:  npm run seed
require('dotenv').config();
const mongoose = require('mongoose');
const { connectDB } = require('./db');
const Rol = require('./models/Rol');
const Usuario = require('./models/Usuario');
const Equipo = require('./models/Equipo');
const { hashPassword } = require('./passwords');

(async () => {
  await connectDB();
  const nombreAdmin = process.env.ADMIN_ROLE_NAME || 'Administrador';
  const nombreUser = process.env.DEFAULT_ROLE_NAME || 'Usuario';
  const up = (n) => Rol.findOneAndUpdate({ nombre_rol: n }, { $setOnInsert: { nombre_rol: n } }, { upsert: true, new: true });
  const admin = await up(nombreAdmin);
  await up(nombreUser);

  const correo = (process.env.SEED_ADMIN_CORREO || 'admin@correo.com').toLowerCase();
  if (!(await Usuario.exists({ correo }))) {
    await Usuario.create({
      correo, nombre_completo: 'Administrador',
      contrasena: await hashPassword(process.env.SEED_ADMIN_PASSWORD || 'Admin12345'),
      idroles: admin._id,
    });
    console.log('Admin creado:', correo);
  }
  for (const e of [
    { nombre_activo: 'Radio Motorola', serial_unico: 'RAD-001', estado: 'Bueno' },
    { nombre_activo: 'Linterna táctica', serial_unico: 'LIN-001', estado: 'Regular' },
  ]) await Equipo.updateOne({ serial_unico: e.serial_unico }, { $setOnInsert: e }, { upsert: true });

  console.log('Seed listo');
  await mongoose.disconnect();
})().catch((e) => { console.error(e); process.exit(1); });
