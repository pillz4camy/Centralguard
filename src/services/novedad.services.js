import mongoose from 'mongoose';
import Novedad, { ESTADOS_NOVEDAD, TIPOS_NOVEDAD } from '../model/novedad.model.js';
import { HttpError } from '../middleware/errors.js';

const validarId = (id) => {
  if (!mongoose.isValidObjectId(id)) throw new HttpError(400, 'El id no es válido');
  return String(id);
};

export const createNovedadService = async (body) => {
  const { turno, tipo_novedad, hora_reporte, descripcion_hechos, evidencias, estado } = body || {};

  if (!turno || !descripcion_hechos) {
    throw new HttpError(400, 'turno y descripcion_hechos son obligatorios');
  }

  validarId(turno);

  const tipo = tipo_novedad && TIPOS_NOVEDAD.includes(tipo_novedad) ? tipo_novedad : 'Seguridad';
  const est = estado && ESTADOS_NOVEDAD.includes(estado) ? estado : 'Pendiente';

  const n = await Novedad.create({
    turno,
    tipo_novedad: tipo,
    hora_reporte: hora_reporte ? new Date(hora_reporte) : new Date(),
    descripcion_hechos: String(descripcion_hechos).trim(),
    evidencias: Array.isArray(evidencias) ? evidencias : [],
    estado: est
  });

  return Novedad.findById(n._id).populate({
    path: 'turno',
    populate: [
      { path: 'empleado', select: 'nombre apellido correo documento' },
      { path: 'puesto_vigilancia', select: 'nombre_identificador tipo_puesto' },
      { path: 'conjunto', select: 'nombre_conjunto nit' }
    ]
  });
};

export const getNovedadesService = async (query = {}) => {
  const filtro = {};
  if (query.estado) {
    if (!ESTADOS_NOVEDAD.includes(query.estado)) throw new HttpError(400, 'Estado inválido');
    filtro.estado = query.estado;
  }
  if (query.tipo_novedad) {
    if (!TIPOS_NOVEDAD.includes(query.tipo_novedad)) throw new HttpError(400, 'Tipo de novedad inválido');
    filtro.tipo_novedad = query.tipo_novedad;
  }
  if (query.turno) filtro.turno = validarId(query.turno);

  return Novedad.find(filtro)
    .populate({
      path: 'turno',
      populate: [
        { path: 'empleado', select: 'nombre apellido correo documento' },
        { path: 'puesto_vigilancia', select: 'nombre_identificador tipo_puesto' },
        { path: 'conjunto', select: 'nombre_conjunto nit' }
      ]
    })
    .sort({ createdAt: -1 });
};

export const getNovedadByIdService = async (id) => {
  const n = await Novedad.findById(validarId(id))
    .populate({
      path: 'turno',
      populate: [
        { path: 'empleado', select: 'nombre apellido correo documento' },
        { path: 'puesto_vigilancia', select: 'nombre_identificador tipo_puesto' },
        { path: 'conjunto', select: 'nombre_conjunto nit' }
      ]
    });

  if (!n) throw new HttpError(404, 'Novedad no encontrada');
  return n;
};

export const updateNovedadService = async (id, body, parcial = false) => {
  validarId(id);
  const datos = {};
  
  if (body.turno) datos.turno = validarId(body.turno);
  if (body.tipo_novedad) {
    if (!TIPOS_NOVEDAD.includes(body.tipo_novedad)) throw new HttpError(400, 'Tipo de novedad inválido');
    datos.tipo_novedad = body.tipo_novedad;
  }
  if (body.hora_reporte) datos.hora_reporte = new Date(body.hora_reporte);
  if (body.descripcion_hechos !== undefined) datos.descripcion_hechos = String(body.descripcion_hechos).trim();
  if (body.evidencias !== undefined && Array.isArray(body.evidencias)) datos.evidencias = body.evidencias;
  if (body.estado !== undefined) {
    if (!ESTADOS_NOVEDAD.includes(body.estado)) throw new HttpError(400, 'Estado de novedad inválido');
    datos.estado = body.estado;
  }

  if (!parcial && (!datos.descripcion_hechos || !datos.estado)) {
    throw new HttpError(400, 'Para PUT se requieren descripcion_hechos y estado');
  }

  const n = await Novedad.findByIdAndUpdate(id, datos, { new: true, runValidators: true })
    .populate({
      path: 'turno',
      populate: [
        { path: 'empleado', select: 'nombre apellido correo documento' },
        { path: 'puesto_vigilancia', select: 'nombre_identificador tipo_puesto' },
        { path: 'conjunto', select: 'nombre_conjunto nit' }
      ]
    });

  if (!n) throw new HttpError(404, 'Novedad no encontrada');
  return n;
};

export const deleteNovedadService = async (id) => {
  const n = await Novedad.findByIdAndDelete(validarId(id));
  if (!n) throw new HttpError(404, 'Novedad no encontrada');
  return n;
};
