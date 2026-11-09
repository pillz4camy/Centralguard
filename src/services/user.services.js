import mongoose from 'mongoose';
import User, { ROLES_USUARIO } from '../model/user.model.js';
import { HttpError } from '../middleware/errors.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const validarId = (id) => {
  if (!mongoose.isValidObjectId(id)) throw new HttpError(400, 'El id no es válido');
  return String(id);
};

export const registrar = async (body, esAdmin = false) => {
  const { nombre, apellido, correo, contrasenia, documento, telefono, rol } = body || {};

  const docNumero = typeof documento === 'object' ? documento?.numero : documento;
  const docTipo = typeof documento === 'object' ? (documento?.tipo || 'CC') : 'CC';

  if (!nombre || !apellido || !correo || !contrasenia || !docNumero) {
    throw new HttpError(400, 'Nombre, apellido, correo, contraseña y número de documento son obligatorios');
  }

  const email = correo.toLowerCase().trim();
  const existe = await User.findOne({ correo: email });
  if (existe) throw new HttpError(400, 'El correo ya está registrado');

  const passwordHash = await bcrypt.hash(contrasenia, 10);

  // Solo un admin autenticado puede asignar rol diferente a vigilante
  const rolAsignado = esAdmin && rol && ROLES_USUARIO.includes(rol) ? rol : 'vigilante';

  let telefonoData;
  if (telefono) {
    if (typeof telefono === 'object') {
      telefonoData = {
        tipo: telefono.tipo || 'móvil',
        numero: String(telefono.numero || '').trim()
      };
    } else {
      telefonoData = {
        tipo: 'móvil',
        numero: String(telefono).trim()
      };
    }
  }

  const usuario = await User.create({
    nombre: nombre.trim(),
    apellido: apellido.trim(),
    correo: email,
    contrasenia: passwordHash,
    documento: {
      tipo: docTipo,
      numero: String(docNumero).trim()
    },
    telefono: telefonoData,
    rol: rolAsignado
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

  return { 
    token, 
    usuario: { 
      id: usuario._id, 
      nombre: usuario.nombre, 
      apellido: usuario.apellido,
      correo: usuario.correo, 
      rol: usuario.rol 
    } 
  };
};

export const perfil = async (id) => {
  const u = await User.findById(validarId(id)).select('-contrasenia');
  if (!u) throw new HttpError(404, 'Usuario no encontrado');
  return u;
};

export const listar = async (query = {}) => {
  const filtro = {};
  if (query.rol) {
    if (!ROLES_USUARIO.includes(query.rol)) throw new HttpError(400, 'Rol inválido');
    filtro.rol = query.rol;
  }
  if (query.activo !== undefined) filtro.activo = query.activo === 'true';

  return User.find(filtro).select('-contrasenia').sort({ createdAt: -1 });
};

export const actualizar = async (id, body) => {
  validarId(id);
  const datos = {};
  if (body.nombre) datos.nombre = body.nombre.trim();
  if (body.apellido) datos.apellido = body.apellido.trim();
  if (body.correo) datos.correo = body.correo.toLowerCase().trim();
  if (body.documento) {
    const docNumero = typeof body.documento === 'object' ? body.documento.numero : body.documento;
    const docTipo = typeof body.documento === 'object' ? (body.documento.tipo || 'CC') : 'CC';
    datos.documento = { tipo: docTipo, numero: String(docNumero).trim() };
  }
  if (body.telefono) {
    if (typeof body.telefono === 'object') {
      datos.telefono = {
        tipo: body.telefono.tipo || 'móvil',
        numero: String(body.telefono.numero || '').trim()
      };
    } else {
      datos.telefono = {
        tipo: 'móvil',
        numero: String(body.telefono).trim()
      };
    }
  }
  if (body.activo !== undefined) datos.activo = Boolean(body.activo);
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
