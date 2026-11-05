import mongoose from 'mongoose';
import Equipment from '../model/equipment.model.js';
import { HttpError } from '../middleware/errors.js';

const validarId = (id) => {
  if (!mongoose.isValidObjectId(id)) throw new HttpError(400, 'El id no es válido');
  return String(id);
};

export const listar = async (query = {}) => {
  const filtro = {};
  if (query.estado) filtro.estado = query.estado;
  return Equipment.find(filtro).sort({ createdAt: -1 });
};

export const obtener = async (id) => {
  const eq = await Equipment.findById(validarId(id));
  if (!eq) throw new HttpError(404, 'Equipo no encontrado');
  return eq;
};

export const crear = async (body) => {
  const { nombre, serial } = body || {};
  if (!nombre || !serial) throw new HttpError(400, 'Nombre y serial son obligatorios');
  return Equipment.create(body);
};

export const actualizar = async (id, body) => {
  validarId(id);
  const eq = await Equipment.findByIdAndUpdate(id, body, { new: true, runValidators: true });
  if (!eq) throw new HttpError(404, 'Equipo no encontrado');
  return eq;
};

export const eliminar = async (id) => {
  const eq = await Equipment.findByIdAndDelete(validarId(id));
  if (!eq) throw new HttpError(404, 'Equipo no encontrado');
  return eq;
};