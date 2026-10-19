import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Usuario from '../models/usuario.model.js';
import { HttpError } from '../middleware/errors.js';
import { limpiar, REGEX } from '../middleware/validar.js';
import { publico } from './usuario.services.js';

const DUMMY_HASH = bcrypt.hashSync('no-existe', 10); // para que el tiempo de respuesta no revele si el correo existe

const reglasRegistro = {
  nombre: { req: true, max: 80 },
  apellido: { req: true, max: 80 },
  documento: { req: true, regex: REGEX.documento, msg: 'documento debe tener 5-20 letras, números, punto o guion' },
  correo: { req: true, lower: true, max: 254, regex: REGEX.correo, msg: 'El correo no tiene un formato válido' },
  telefono: { max: 20, regex: REGEX.telefono, msg: 'telefono tiene un formato inválido' },
  contrasena: { req: true, min: 8, max: 72, sinTrim: true },
};

// Registro público: SIEMPRE queda como vigilante y "pendiente" hasta que un administrador lo apruebe.
// (rol y estado_registro del body se ignoran a propósito)
export async function registrar(body) {
  const { contrasena, ...datos } = limpiar(body, reglasRegistro);
  const hash = await bcrypt.hash(contrasena, 10);
  const u = await Usuario.create({ ...datos, contrasena: hash });
  return publico(u);
}

export async function login(body) {
  const { correo, contrasena } = body || {};
  if (typeof correo !== 'string' || typeof contrasena !== 'string' || !correo.trim() || !contrasena) {
    throw new HttpError(400, 'correo y contrasena son obligatorios (texto)');
  }
  const u = await Usuario.findOne({ correo: correo.trim().toLowerCase() }).select('+contrasena');
  const ok = await bcrypt.compare(contrasena, u?.contrasena || DUMMY_HASH);
  if (!u || !ok) throw new HttpError(401, 'Correo o contraseña incorrectos');

  if (u.estado_registro === 'pendiente') {
    throw new HttpError(403, 'Cuenta en revisión: necesitas ser aceptado por el administrador para iniciar sesión.');
  }
  if (u.estado_registro === 'rechazado') {
    throw new HttpError(403, 'Tu registro fue rechazado. Comunícate con el administrador si crees que es un error.');
  }
  const token = jwt.sign({ idusuario: String(u._id), rol: u.rol }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES || '2h',
  });
  return { token, usuario: publico(u) };
}

export async function cambiarContrasena(idusuario, body) {
  const { actual, nueva } = body || {};
  if (typeof actual !== 'string' || typeof nueva !== 'string') throw new HttpError(400, 'actual y nueva son obligatorias (texto)');
  if (nueva.length < 8 || nueva.length > 72) throw new HttpError(400, 'La nueva contraseña debe tener entre 8 y 72 caracteres');
  const u = await Usuario.findById(idusuario).select('+contrasena');
  if (!u || !(await bcrypt.compare(actual, u.contrasena))) throw new HttpError(401, 'La contraseña actual es incorrecta');
  u.contrasena = await bcrypt.hash(nueva, 10);
  await u.save();
  return { message: 'Contraseña actualizada' };
}
