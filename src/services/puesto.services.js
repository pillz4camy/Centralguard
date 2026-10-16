import mongoose from 'mongoose';
import Puesto from '../models/puesto.model.js';
import { HttpError } from '../middleware/errors.js';

const CAMPOS = ['nombre', 'tipo', 'ubicacion', 'descripcion', 'vigilantes_requeridos', 'activo'];

const validarId = (id) => {
  if (!mongoose.isValidObjectId(id)) throw new HttpError(400, 'El id no es válido');
  return String(id);
};

// Toma solo los campos permitidos y valida tipos básicos
const limpiar = (body = {}, parcial = false) => {
  const out = {};
  for (const c of CAMPOS) {
    const v = body[c];
    if (v === undefined) continue;
    if (c === 'activo') {
      if (typeof v !== 'boolean') throw new HttpError(400, 'activo debe ser true o false');
    } else if (c === 'vigilantes_requeridos') {
      if (!Number.isInteger(v)) throw new HttpError(400, 'vigilantes_requeridos debe ser un número entero');
    } else if (typeof v !== 'string') {
      throw new HttpError(400, `${c} debe ser texto`);
    }
    out[c] = typeof v === 'string' ? v.trim() : v;
  }
  if (!parcial && !out.nombre) throw new HttpError(400, 'nombre es obligatorio');
  if (parcial && !Object.keys(out).length) throw new HttpError(400, 'No enviaste ningún campo para actualizar');
  if (out.nombre === '') throw new HttpError(400, 'nombre no puede estar vacío');
  return out;
};

export const dbGetPuestos = (query = {}) => {
  const filtro = {};
  if (query.activo !== undefined) {
    if (!['true', 'false'].includes(query.activo)) throw new HttpError(400, 'activo debe ser true o false');
    filtro.activo = query.activo === 'true';
  }
  if (query.tipo !== undefined) {
    if (typeof query.tipo !== 'string') throw new HttpError(400, 'tipo debe ser texto');
    filtro.tipo = query.tipo;
  }
  return Puesto.find(filtro).sort({ nombre: 1 });
};

export const dbGetPuesto = async (id) => {
  const p = await Puesto.findById(validarId(id));
  if (!p) throw new HttpError(404, 'Puesto no encontrado');
  return p;
};

export const dbCreatePuesto = (body) => Puesto.create(limpiar(body));

// PUT = reemplazo completo, PATCH = parcial
export const dbUpdatePuesto = async (id, body, parcial = false) => {
  const datos = limpiar(body, parcial);
  if (!parcial) {
    // En PUT los campos opcionales no enviados vuelven a su valor por defecto
    datos.tipo ??= 'Otro';
    datos.vigilantes_requeridos ??= 1;
    datos.activo ??= true;
    datos.ubicacion ??= '';
    datos.descripcion ??= '';
  }
  const p = await Puesto.findByIdAndUpdate(validarId(id), datos, { new: true, runValidators: true });
  if (!p) throw new HttpError(404, 'Puesto no encontrado');
  return p;
};

export const dbDeletePuesto = async (id) => {
  const p = await Puesto.findByIdAndDelete(validarId(id));
  if (!p) throw new HttpError(404, 'Puesto no encontrado');
  return p;
};
