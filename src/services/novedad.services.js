import mongoose from 'mongoose';
import Novedad, { ESTADOS_NOVEDAD } from '../model/novedad.model.js';
import { HttpError } from '../middleware/errors.js';

const validarId = (id) => {
  if (!mongoose.isValidObjectId(id)) throw new HttpError(400, 'El id no es válido');
  return String(id);
};

export const createNovedadService = async (body) => {
  const { hora_reporte, descripcion_hechos, estado } = body || {};
  if (!hora_reporte || !descripcion_hechos) {
    throw new HttpError(400, 'hora_reporte y descripcion_hechos son obligatorios');
  }

  return Novedad.create({
    hora_reporte: String(hora_reporte).trim(),
    descripcion_hechos: String(descripcion_hechos).trim(),
    estado: estado && ESTADOS_NOVEDAD.includes(estado) ? estado : 'Pendiente'
  });
};

export const getNovedadesService = async () => Novedad.find().sort({ createdAt: -1 });

export const getNovedadByIdService = async (id) => {
  const n = await Novedad.findById(validarId(id));
  if (!n) throw new HttpError(404, 'Novedad no encontrada');
  return n;
};

export const updateNovedadService = async (id, body, parcial = false) => {
  validarId(id);
  const datos = {};
  
  if (body.hora_reporte !== undefined) datos.hora_reporte = String(body.hora_reporte).trim();
  if (body.descripcion_hechos !== undefined) datos.descripcion_hechos = String(body.descripcion_hechos).trim();
  if (body.estado !== undefined) {
    if (!ESTADOS_NOVEDAD.includes(body.estado)) throw new HttpError(400, 'Estado de novedad inválido');
    datos.estado = body.estado;
  }

  if (!parcial && (!datos.hora_reporte || !datos.descripcion_hechos || !datos.estado)) {
    throw new HttpError(400, 'Para PUT se requieren hora_reporte, descripcion_hechos y estado');
  }

  const n = await Novedad.findByIdAndUpdate(id, datos, { new: true, runValidators: true });
  if (!n) throw new HttpError(404, 'Novedad no encontrada');
  return n;
};

export const deleteNovedadService = async (id) => {
  const n = await Novedad.findByIdAndDelete(validarId(id));
  if (!n) throw new HttpError(404, 'Novedad no encontrada');
  return n;
};