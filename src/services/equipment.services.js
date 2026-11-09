import mongoose from 'mongoose';
import Equipment, { ESTADOS_EQUIPO } from '../model/equipment.model.js';
import { HttpError } from '../middleware/errors.js';

const validarId = (id) => {
  if (!mongoose.isValidObjectId(id)) throw new HttpError(400, 'El id no es válido');
  return String(id);
};

export const listar = async (query = {}) => {
  const filtro = {};
  if (query.estado) {
    if (!ESTADOS_EQUIPO.includes(query.estado)) throw new HttpError(400, 'Estado inválido');
    filtro.estado = query.estado;
  }
  if (query.serial) {
    filtro.serial_unico = String(query.serial).trim().toUpperCase();
  }
  return Equipment.find(filtro).sort({ createdAt: -1 });
};

export const obtener = async (id) => {
  const eq = await Equipment.findById(validarId(id));
  if (!eq) throw new HttpError(404, 'Equipo no encontrado');
  return eq;
};

export const crear = async (body) => {
  const nombre_activo = body.nombre_activo || body.nombre;
  const serial_unico = body.serial_unico || body.serial;
  const estado = body.estado || 'Bueno';
  const observaciones = body.observaciones || '';

  if (!nombre_activo || !serial_unico) {
    throw new HttpError(400, 'nombre_activo y serial_unico son obligatorios');
  }

  if (!ESTADOS_EQUIPO.includes(estado)) {
    throw new HttpError(400, `Estado inválido. Opciones: ${ESTADOS_EQUIPO.join(', ')}`);
  }

  return Equipment.create({
    nombre_activo: String(nombre_activo).trim(),
    serial_unico: String(serial_unico).trim().toUpperCase(),
    estado,
    observaciones: String(observaciones).trim()
  });
};

export const actualizar = async (id, body) => {
  validarId(id);
  const datos = {};
  if (body.nombre_activo || body.nombre) datos.nombre_activo = String(body.nombre_activo || body.nombre).trim();
  if (body.serial_unico || body.serial) datos.serial_unico = String(body.serial_unico || body.serial).trim().toUpperCase();
  if (body.estado) {
    if (!ESTADOS_EQUIPO.includes(body.estado)) throw new HttpError(400, 'Estado inválido');
    datos.estado = body.estado;
  }
  if (body.observaciones !== undefined) datos.observaciones = String(body.observaciones).trim();

  const eq = await Equipment.findByIdAndUpdate(id, datos, { new: true, runValidators: true });
  if (!eq) throw new HttpError(404, 'Equipo no encontrado');
  return eq;
};

export const eliminar = async (id) => {
  const eq = await Equipment.findByIdAndDelete(validarId(id));
  if (!eq) throw new HttpError(404, 'Equipo no encontrado');
  return eq;
};
