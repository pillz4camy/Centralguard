import mongoose from 'mongoose';
import RegistroAcceso from '../model/registro_acceso.model.js';
import { HttpError } from '../middleware/errors.js';

const validarId = (id) => {
  if (!mongoose.isValidObjectId(id)) throw new HttpError(400, 'El id no es válido');
  return String(id);
};

export const crearRegistroAcceso = async (body) => {
  const { turno, persona, vehiculo, apartamento_destino, hora_entrada, observaciones_acceso } = body || {};

  if (!turno || !persona || !apartamento_destino) {
    throw new HttpError(400, 'turno, persona y apartamento_destino son obligatorios');
  }

  validarId(turno);
  validarId(persona);
  if (vehiculo) validarId(vehiculo);

  const reg = await RegistroAcceso.create({
    turno,
    persona,
    vehiculo: vehiculo || null,
    apartamento_destino: String(apartamento_destino).trim(),
    hora_entrada: hora_entrada ? new Date(hora_entrada) : new Date(),
    observaciones_acceso: observaciones_acceso ? String(observaciones_acceso).trim() : ''
  });

  return RegistroAcceso.findById(reg._id)
    .populate('persona', 'primer_nombre primer_apellido documento tipo_persona empresa_procedencia')
    .populate('vehiculo', 'placa tipo marca modelo color')
    .populate('turno', 'puesto_vigilancia empleado');
};

export const listarRegistrosAcceso = async (query = {}) => {
  const filtro = {};
  if (query.turno) filtro.turno = validarId(query.turno);
  if (query.persona) filtro.persona = validarId(query.persona);
  if (query.apartamento) filtro.apartamento_destino = String(query.apartamento).trim();
  if (query.en_predio === 'true') filtro.hora_salida = null;

  return RegistroAcceso.find(filtro)
    .populate('persona', 'primer_nombre primer_apellido documento tipo_persona empresa_procedencia')
    .populate('vehiculo', 'placa tipo marca modelo color')
    .populate('turno', 'puesto_vigilancia empleado')
    .sort({ hora_entrada: -1 });
};

export const obtenerRegistroAcceso = async (id) => {
  const reg = await RegistroAcceso.findById(validarId(id))
    .populate('persona', 'primer_nombre primer_apellido documento tipo_persona empresa_procedencia')
    .populate('vehiculo', 'placa tipo marca modelo color')
    .populate('turno', 'puesto_vigilancia empleado');

  if (!reg) throw new HttpError(404, 'Registro de acceso no encontrado');
  return reg;
};

export const registrarSalida = async (id, body = {}) => {
  validarId(id);
  const hora_salida = body.hora_salida ? new Date(body.hora_salida) : new Date();

  const reg = await RegistroAcceso.findByIdAndUpdate(
    id,
    { hora_salida },
    { new: true, runValidators: true }
  )
    .populate('persona', 'primer_nombre primer_apellido documento tipo_persona empresa_procedencia')
    .populate('vehiculo', 'placa tipo marca modelo color');

  if (!reg) throw new HttpError(404, 'Registro de acceso no encontrado');
  return reg;
};

export const actualizarRegistroAcceso = async (id, body) => {
  validarId(id);
  const datos = {};
  if (body.turno) datos.turno = validarId(body.turno);
  if (body.persona) datos.persona = validarId(body.persona);
  if (body.vehiculo !== undefined) datos.vehiculo = body.vehiculo ? validarId(body.vehiculo) : null;
  if (body.apartamento_destino) datos.apartamento_destino = String(body.apartamento_destino).trim();
  if (body.hora_entrada) datos.hora_entrada = new Date(body.hora_entrada);
  if (body.hora_salida !== undefined) datos.hora_salida = body.hora_salida ? new Date(body.hora_salida) : null;
  if (body.observaciones_acceso !== undefined) datos.observaciones_acceso = String(body.observaciones_acceso).trim();

  const reg = await RegistroAcceso.findByIdAndUpdate(id, datos, { new: true, runValidators: true })
    .populate('persona', 'primer_nombre primer_apellido documento tipo_persona empresa_procedencia')
    .populate('vehiculo', 'placa tipo marca modelo color');

  if (!reg) throw new HttpError(404, 'Registro de acceso no encontrado');
  return reg;
};

export const eliminarRegistroAcceso = async (id) => {
  const reg = await RegistroAcceso.findByIdAndDelete(validarId(id));
  if (!reg) throw new HttpError(404, 'Registro de acceso no encontrado');
  return reg;
};
