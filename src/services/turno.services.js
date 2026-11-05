import mongoose from 'mongoose';
import Turno, { ESTADOS_TURNO } from '../model/turno.model.js';
import { HttpError } from '../middleware/errors.js';

const validarId = (id) => {
  if (!mongoose.isValidObjectId(id)) throw new HttpError(400, 'El id no es válido');
  return String(id);
};

export const crearTurno = async (body) => {
  const { fecha, hora_inicio, hora_fin, estado } = body || {};
  if (!hora_inicio) throw new HttpError(400, 'La hora_inicio es obligatoria');

  return Turno.create({
    fecha: fecha ? new Date(fecha) : new Date(),
    hora_inicio: String(hora_inicio).trim(),
    hora_fin: hora_fin ? String(hora_fin).trim() : null,
    estado: estado && ESTADOS_TURNO.includes(estado) ? estado : 'activo',
  });
};

export const listarTurnos = async (query = {}) => {
  const filtro = {};
  if (query.estado) {
    if (!ESTADOS_TURNO.includes(query.estado)) throw new HttpError(400, 'Estado de turno inválido');
    filtro.estado = query.estado;
  }
  return Turno.find(filtro).sort({ fecha: -1 });
};

export const obtenerTurno = async (id) => {
  const t = await Turno.findById(validarId(id));
  if (!t) throw new HttpError(404, 'Turno no encontrado');
  return t;
};

export const actualizarTurno = async (id, body) => {
  validarId(id);
  const datos = {};
  if (body.fecha) datos.fecha = new Date(body.fecha);
  if (body.hora_inicio) datos.hora_inicio = String(body.hora_inicio).trim();
  if (body.hora_fin !== undefined) datos.hora_fin = body.hora_fin ? String(body.hora_fin).trim() : null;
  if (body.estado) {
    if (!ESTADOS_TURNO.includes(body.estado)) throw new HttpError(400, 'Estado inválido');
    datos.estado = body.estado;
  }

  const t = await Turno.findByIdAndUpdate(id, datos, { new: true, runValidators: true });
  if (!t) throw new HttpError(404, 'Turno no encontrado');
  return t;
};

export const eliminarTurno = async (id) => {
  const t = await Turno.findByIdAndDelete(validarId(id));
  if (!t) throw new HttpError(404, 'Turno no encontrado');
  return t;
};