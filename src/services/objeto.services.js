import mongoose from 'mongoose';
import Objeto from '../model/objeto.model.js';
import { HttpError } from '../middleware/errors.js';

const validarId = (id) => {
  if (!mongoose.isValidObjectId(id)) throw new HttpError(400, 'El id no es válido');
  return String(id);
};

export const listar = async (query = {}) => {
  const filtro = {};
  if (query.estado) filtro.estado = query.estado;
  return Objeto.find(filtro).sort({ createdAt: -1 });
};

export const obtener = async (id) => {
  const obj = await Objeto.findById(validarId(id));
  if (!obj) throw new HttpError(404, 'Objeto no encontrado');
  return obj;
};

export const crear = async (body) => {
  const { nombre, descripcion } = body || {};
  if (!nombre) throw new HttpError(400, 'El nombre del objeto es obligatorio');
  return Objeto.create(body);
};

export const actualizar = async (id, body) => {
  validarId(id);
  const obj = await Objeto.findByIdAndUpdate(id, body, { new: true, runValidators: true });
  if (!obj) throw new HttpError(404, 'Objeto no encontrado');
  return obj;
};

export const eliminar = async (id) => {
  const obj = await Objeto.findByIdAndDelete(validarId(id));
  if (!obj) throw new HttpError(404, 'Objeto no encontrado');
  return obj;
};