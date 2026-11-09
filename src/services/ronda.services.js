import mongoose from 'mongoose';
import Ronda from '../model/ronda.model.js';
import { HttpError } from '../middleware/errors.js';

const validarId = (id) => {
  if (!mongoose.isValidObjectId(id)) throw new HttpError(400, 'El id no es válido');
  return String(id);
};

export const crearRonda = async (body) => {
  const { turno, hora_marcacion_inicio, hora_marcacion_fin, puestos_validados, puntos_validados, observaciones_ronda } = body || {};

  if (!turno) throw new HttpError(400, 'turno es obligatorio para registrar una ronda');
  validarId(turno);

  let puestos = [];
  const rawPuestos = puestos_validados || puntos_validados;
  if (Array.isArray(rawPuestos)) {
    puestos = rawPuestos;
  } else if (typeof rawPuestos === 'string' && rawPuestos.trim()) {
    puestos = rawPuestos.split(',').map((p) => p.trim());
  }

  const r = await Ronda.create({
    turno,
    hora_marcacion_inicio: hora_marcacion_inicio ? new Date(hora_marcacion_inicio) : new Date(),
    hora_marcacion_fin: hora_marcacion_fin ? new Date(hora_marcacion_fin) : null,
    puestos_validados: puestos,
    observaciones_ronda: observaciones_ronda ? String(observaciones_ronda).trim() : ''
  });

  return Ronda.findById(r._id).populate({
    path: 'turno',
    populate: [
      { path: 'empleado', select: 'nombre apellido' },
      { path: 'puesto_vigilancia', select: 'nombre_identificador' }
    ]
  });
};

export const listarRondas = async (query = {}) => {
  const filtro = {};
  if (query.turno) filtro.turno = validarId(query.turno);

  return Ronda.find(filtro)
    .populate({
      path: 'turno',
      populate: [
        { path: 'empleado', select: 'nombre apellido' },
        { path: 'puesto_vigilancia', select: 'nombre_identificador' }
      ]
    })
    .sort({ createdAt: -1 });
};

export const obtenerRonda = async (id) => {
  const r = await Ronda.findById(validarId(id))
    .populate({
      path: 'turno',
      populate: [
        { path: 'empleado', select: 'nombre apellido' },
        { path: 'puesto_vigilancia', select: 'nombre_identificador' }
      ]
    });

  if (!r) throw new HttpError(404, 'Ronda no encontrada');
  return r;
};

export const actualizarRonda = async (id, body) => {
  validarId(id);
  const datos = {};
  if (body.turno) datos.turno = validarId(body.turno);
  if (body.hora_marcacion_inicio) datos.hora_marcacion_inicio = new Date(body.hora_marcacion_inicio);
  if (body.hora_marcacion_fin !== undefined) datos.hora_marcacion_fin = body.hora_marcacion_fin ? new Date(body.hora_marcacion_fin) : null;

  const rawPuestos = body.puestos_validados || body.puntos_validados;
  if (rawPuestos !== undefined) {
    if (Array.isArray(rawPuestos)) {
      datos.puestos_validados = rawPuestos;
    } else if (typeof rawPuestos === 'string') {
      datos.puestos_validados = rawPuestos.split(',').map((p) => p.trim());
    }
  }

  if (body.observaciones_ronda !== undefined) datos.observaciones_ronda = String(body.observaciones_ronda).trim();

  const r = await Ronda.findByIdAndUpdate(id, datos, { new: true, runValidators: true })
    .populate({
      path: 'turno',
      populate: [
        { path: 'empleado', select: 'nombre apellido' },
        { path: 'puesto_vigilancia', select: 'nombre_identificador' }
      ]
    });

  if (!r) throw new HttpError(404, 'Ronda no encontrada');
  return r;
};

export const eliminarRonda = async (id) => {
  const r = await Ronda.findByIdAndDelete(validarId(id));
  if (!r) throw new HttpError(404, 'Ronda no encontrada');
  return r;
};
