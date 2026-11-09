import mongoose from 'mongoose';
import Turno, { ESTADOS_TURNO } from '../model/turno.model.js';
import { HttpError } from '../middleware/errors.js';

const validarId = (id) => {
  if (!mongoose.isValidObjectId(id)) throw new HttpError(400, 'El id no es válido');
  return String(id);
};

export const crearTurno = async (body, userId = null) => {
  const { conjunto, empleado, puesto_vigilancia, fecha, hora_inicio, hora_fin, estado, observaciones } = body || {};

  const empleadoId = empleado || userId;
  if (!conjunto || !empleadoId || !puesto_vigilancia) {
    throw new HttpError(400, 'conjunto, empleado y puesto_vigilancia son obligatorios para crear un turno');
  }

  validarId(conjunto);
  validarId(empleadoId);
  validarId(puesto_vigilancia);

  const estadoTurno = estado && ESTADOS_TURNO.includes(estado) ? estado : 'activo';

  const t = await Turno.create({
    conjunto,
    empleado: empleadoId,
    puesto_vigilancia,
    fecha: fecha ? new Date(fecha) : new Date(),
    hora_inicio: hora_inicio ? new Date(hora_inicio) : new Date(),
    hora_fin: hora_fin ? new Date(hora_fin) : null,
    estado: estadoTurno,
    observaciones: observaciones ? String(observaciones).trim() : ''
  });

  return Turno.findById(t._id)
    .populate('conjunto', 'nombre_conjunto nit')
    .populate('empleado', 'nombre apellido correo documento rol')
    .populate('puesto_vigilancia', 'nombre_identificador tipo_puesto');
};

export const listarTurnos = async (query = {}) => {
  const filtro = {};
  if (query.estado) {
    if (!ESTADOS_TURNO.includes(query.estado)) throw new HttpError(400, 'Estado de turno inválido');
    filtro.estado = query.estado;
  }
  if (query.conjunto) filtro.conjunto = validarId(query.conjunto);
  if (query.empleado) filtro.empleado = validarId(query.empleado);
  if (query.puesto) filtro.puesto_vigilancia = validarId(query.puesto);

  return Turno.find(filtro)
    .populate('conjunto', 'nombre_conjunto nit')
    .populate('empleado', 'nombre apellido correo documento rol')
    .populate('puesto_vigilancia', 'nombre_identificador tipo_puesto')
    .sort({ fecha: -1, createdAt: -1 });
};

export const obtenerTurno = async (id) => {
  const t = await Turno.findById(validarId(id))
    .populate('conjunto', 'nombre_conjunto nit direccion')
    .populate('empleado', 'nombre apellido correo documento rol')
    .populate('puesto_vigilancia', 'nombre_identificador tipo_puesto');

  if (!t) throw new HttpError(404, 'Turno no encontrado');
  return t;
};

export const actualizarTurno = async (id, body) => {
  validarId(id);
  const datos = {};
  if (body.conjunto) datos.conjunto = validarId(body.conjunto);
  if (body.empleado) datos.empleado = validarId(body.empleado);
  if (body.puesto_vigilancia) datos.puesto_vigilancia = validarId(body.puesto_vigilancia);
  if (body.fecha) datos.fecha = new Date(body.fecha);
  if (body.hora_inicio) datos.hora_inicio = new Date(body.hora_inicio);
  if (body.hora_fin !== undefined) datos.hora_fin = body.hora_fin ? new Date(body.hora_fin) : null;
  if (body.observaciones !== undefined) datos.observaciones = String(body.observaciones).trim();
  if (body.estado) {
    if (!ESTADOS_TURNO.includes(body.estado)) throw new HttpError(400, 'Estado inválido');
    datos.estado = body.estado;
  }

  const t = await Turno.findByIdAndUpdate(id, datos, { new: true, runValidators: true })
    .populate('conjunto', 'nombre_conjunto nit')
    .populate('empleado', 'nombre apellido correo documento rol')
    .populate('puesto_vigilancia', 'nombre_identificador tipo_puesto');

  if (!t) throw new HttpError(404, 'Turno no encontrado');
  return t;
};

export const finalizarTurno = async (id) => {
  validarId(id);
  const t = await Turno.findByIdAndUpdate(
    id, 
    { estado: 'finalizado', hora_fin: new Date() }, 
    { new: true, runValidators: true }
  )
    .populate('conjunto', 'nombre_conjunto nit')
    .populate('empleado', 'nombre apellido correo documento rol')
    .populate('puesto_vigilancia', 'nombre_identificador tipo_puesto');

  if (!t) throw new HttpError(404, 'Turno no encontrado');
  return t;
};

export const eliminarTurno = async (id) => {
  const t = await Turno.findByIdAndDelete(validarId(id));
  if (!t) throw new HttpError(404, 'Turno no encontrado');
  return t;
};
