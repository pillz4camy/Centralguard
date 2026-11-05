import mongoose from 'mongoose';
import User, { ROLES_USUARIO } from '../model/user.model.js';
import { HttpError } from '../middleware/errors.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const validarId = (id) => {
  if (!mongoose.isValidObjectId(id)) throw new HttpError(400, 'El id no es válido');
  return String(id);
};

export const registrar = async (body) => {
  const { nombre, correo, contrasenia, rol } = body || {};
  if (!nombre || !correo || !contrasenia) {
    throw new HttpError(400, 'Nombre, correo y contraseña son obligatorios');
  }

  const existe = await User.findOne({ correo: correo.toLowerCase().trim() });
  if (existe) throw new HttpError(400, 'El correo ya está registrado');

  const passwordHash = await bcrypt.hash(contrasenia, 10);

  const usuario = await User.create({
    nombre: nombre.trim(),
    correo: correo.toLowerCase().trim(),
    contrasenia: passwordHash,
    rol: rol && ROLES_USUARIO.includes(rol) ? rol : 'vigilante'
  });

  const obj = usuario.toObject();
  delete obj.contrasenia;
  return obj;
};

export const login = async (body) => {
  const { correo, contrasenia } = body || {};
  if (!correo || !contrasenia) throw new HttpError(400, 'Correo y contraseña requeridos');

  const usuario = await User.findOne({ correo: correo.toLowerCase().trim() });
  if (!usuario) throw new HttpError(401, 'Credenciales inválidas');

  const match = await bcrypt.compare(contrasenia, usuario.contrasenia);
  if (!match) throw new HttpError(401, 'Credenciales inválidas');

  const token = jwt.sign(
    { id: usuario._id, rol: usuario.rol, correo: usuario.correo },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );

  return { token, usuario: { id: usuario._id, nombre: usuario.nombre, correo: usuario.correo, rol: usuario.rol } };
};

export const perfil = async (id) => {
  const u = await User.findById(validarId(id)).select('-contrasenia');
  if (!u) throw new HttpError(404, 'Usuario no encontrado');
  return u;
};

export const listar = async () => User.find().select('-contrasenia').sort({ createdAt: -1 });

export const actualizar = async (id, body) => {
  validarId(id);
  const datos = {};
  if (body.nombre) datos.nombre = body.nombre.trim();
  if (body.correo) datos.correo = body.correo.toLowerCase().trim();
  if (body.rol) {
    if (!ROLES_USUARIO.includes(body.rol)) throw new HttpError(400, 'Rol inválido');
    datos.rol = body.rol;
  }
  if (body.contrasenia) datos.contrasenia = await bcrypt.hash(body.contrasenia, 10);

  const u = await User.findByIdAndUpdate(id, datos, { new: true, runValidators: true }).select('-contrasenia');
  if (!u) throw new HttpError(404, 'Usuario no encontrado');
  return u;
};

export const eliminar = async (id) => {
  const u = await User.findByIdAndDelete(validarId(id));
  if (!u) throw new HttpError(404, 'Usuario no encontrado');
  return u;
};