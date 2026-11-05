import mongoose from 'mongoose';
import Ronda from '../model/ronda.model.js';
import { HttpError } from '../middleware/errors.js';

const validarId = (id) => {
  if (!mongoose.isValidObjectId(id)) throw new HttpError(400, 'El id no es válido');
  return String(id);
};

export const crearRonda = async (body) => {
  const { hora_marcacion_inicio, hora_marcacion_fin, puntos_validados, observaciones_ronda } = body || {};
  if (!hora_marcacion_inicio) throw new HttpError(400, 'hora_marcacion_inicio es obligatoria');

  return Ronda.create({
    hora_marcacion_inicio: String(hora_marcacion_inicio).trim(),
    hora_marcacion_fin: hora_marcacion_fin ? String(hora_marcacion_fin).trim() : null,
    puntos_validados: puntos_validados ? String(puntos_validados).trim() : '',
    observaciones_ronda: observaciones_ronda ? String(observaciones_ronda).trim() : '',
  });
};

export const listarRondas = async () => Ronda.find().sort({ createdAt: -1 });

export const obtenerRonda = async (id) => {
  const r = await Ronda.findById(validarId(id));
  if (!r) throw new HttpError(404, 'Ronda no encontrada');
  return r;
};

export const actualizarRonda = async (id, body) => {
  validarId(id);
  const datos = {};
  if (body.hora_marcacion_inicio) datos.hora_marcacion_inicio = String(body.hora_marcacion_inicio).trim();
  if (body.hora_marcacion_fin !== undefined) datos.hora_marcacion_fin = body.hora_marcacion_fin ? String(body.hora_marcacion_fin).trim() : null;
  if (body.puntos_validados !== undefined) datos.puntos_validados = String(body.puntos_validados).trim();
  if (body.observaciones_ronda !== undefined) datos.observaciones_ronda = String(body.observaciones_ronda).trim();

  const r = await Ronda.findByIdAndUpdate(id, datos, { new: true, runValidators: true });
  if (!r) throw new HttpError(404, 'Ronda no encontrada');
  return r;
};

export const eliminarRonda = async (id) => {
  const r = await Ronda.findByIdAndDelete(validarId(id));
  if (!r) throw new HttpError(404, 'Ronda no encontrada');
  return r;
};