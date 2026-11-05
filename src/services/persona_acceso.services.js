import mongoose from 'mongoose';
import PersonaAcceso from '../model/persona_acceso.model.js';
import { HttpError } from '../middleware/errors.js';

const validarId = (id) => {
  if (!mongoose.isValidObjectId(id)) throw new HttpError(400, 'El id no es válido');
  return String(id);
};

export const listar = async (query = {}) => {
  const filtro = {};
  if (query.tipo) filtro.tipo = query.tipo;
  return PersonaAcceso.find(filtro).sort({ createdAt: -1 });
};

export const obtener = async (id) => {
  const p = await PersonaAcceso.findById(validarId(id));
  if (!p) throw new HttpError(404, 'Persona de acceso no encontrada');
  return p;
};

export const crear = async (body) => {
  const { nombre, documento } = body || {};
  if (!nombre || !documento) throw new HttpError(400, 'Nombre y documento son obligatorios');
  return PersonaAcceso.create(body);
};

export const actualizar = async (id, body) => {
  validarId(id);
  const p = await PersonaAcceso.findByIdAndUpdate(id, body, { new: true, runValidators: true });
  if (!p) throw new HttpError(404, 'Persona de acceso no encontrada');
  return p;
};

export const eliminar = async (id) => {
  const p = await PersonaAcceso.findByIdAndDelete(validarId(id));
  if (!p) throw new HttpError(404, 'Persona de acceso no encontrada');
  return p;
};