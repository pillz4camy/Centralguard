const router = require('express').Router();
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
const Rol = require('../models/Rol');
const { HttpError, wrap } = require('../middleware/errors');
const { hashPassword, verifyPassword } = require('../passwords');

const sign = (u, rol) =>
  jwt.sign({ idusuario: String(u._id), rol }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES || '2h' });

const publico = (u, rol) => ({
  idusuario: String(u._id),
  nombre_completo: u.nombre_completo,
  correo: u.correo,
  idroles: String(u.idroles?._id ?? u.idroles),
  rol,
});

const texto = (v) => typeof v === 'string' && v.trim() !== '';

router.post('/login', wrap(async (req, res) => {
  const { correo, contrasena } = req.body || {};
  // typeof string evita inyección NoSQL (p. ej. {"correo": {"$ne": null}})
  if (!texto(correo) || !texto(contrasena)) throw new HttpError(400, 'correo y contrasena son obligatorios (texto)');

  const u = await Usuario.findOne({ correo: correo.trim().toLowerCase() }).select('+contrasena').populate('idroles');
  if (!u || !(await verifyPassword(contrasena, u.contrasena))) {
    throw new HttpError(401, 'Correo o contraseña incorrectos');
  }
  const rol = u.idroles?.nombre_rol;
  res.status(200).json({ token: sign(u, rol), usuario: publico(u, rol) });
}));

router.post('/register', wrap(async (req, res) => {
  const { correo, contrasena, nombre_completo } = req.body || {};
  if (!texto(correo) || !texto(contrasena) || !texto(nombre_completo)) {
    throw new HttpError(400, 'correo, contrasena y nombre_completo son obligatorios (texto)');
  }
  if (contrasena.length < 6) throw new HttpError(400, 'La contraseña debe tener al menos 6 caracteres');

  const nombreRol = process.env.DEFAULT_ROLE_NAME || 'Usuario';
  const rol = await Rol.findOneAndUpdate(
    { nombre_rol: nombreRol }, { $setOnInsert: { nombre_rol: nombreRol } }, { upsert: true, new: true }
  );
  const u = await Usuario.create({
    correo, nombre_completo, contrasena: await hashPassword(contrasena), idroles: rol._id,
  });
  res.status(201).json({ token: sign(u, rol.nombre_rol), usuario: publico(u, rol.nombre_rol) });
}));

module.exports = router;
