import mongoose from 'mongoose';
import Puesto, { TIPOS_PUESTO } from '../model/puesto.model.js';
import { HttpError } from '../middleware/errors.js';

const validarId = (id) => {
  if (!mongoose.isValidObjectId(id)) throw new HttpError(400, 'El id no es válido');
  return String(id);
};

export const dbGetPuestos = (query = {}) => {
  const filtro = {};
  if (query.activo !== undefined) {
    if (!['true', 'false'].includes(query.activo)) throw new HttpError(400, 'activo debe ser true o false');
    filtro.activo = query.activo === 'true';
  }
  if (query.conjunto) {
    filtro.conjunto = validarId(query.conjunto);
  }
  if (query.tipo_puesto || query.tipo) {
    filtro.tipo_puesto = query.tipo_puesto || query.tipo;
  }

  return Puesto.find(filtro).populate('conjunto', 'nombre_conjunto nit direccion').sort({ nombre_identificador: 1 });
};

export const dbGetPuesto = async (id) => {
  const p = await Puesto.findById(validarId(id)).populate('conjunto', 'nombre_conjunto nit direccion');
  if (!p) throw new HttpError(404, 'Puesto no encontrado');
  return p;
};

export const dbCreatePuesto = async (body) => {
  const nombre_identificador = body.nombre_identificador || body.nombre;
  const conjunto = body.conjunto;
  const tipo_puesto = body.tipo_puesto || body.tipo || 'Portería Principal';
  const descripcion = body.descripcion || '';
  const activo = body.activo !== undefined ? Boolean(body.activo) : true;

  if (!nombre_identificador || !conjunto) {
    throw new HttpError(400, 'nombre_identificador y conjunto son obligatorios');
  }

  validarId(conjunto);

  if (!TIPOS_PUESTO.includes(tipo_puesto)) {
    throw new HttpError(400, `tipo_puesto inválido. Opciones: ${TIPOS_PUESTO.join(', ')}`);
  }

  return Puesto.create({
    nombre_identificador: String(nombre_identificador).trim(),
    conjunto,
    tipo_puesto,
    descripcion: String(descripcion).trim(),
    activo
  });
};

export const dbUpdatePuesto = async (id, body, parcial = false) => {
  validarId(id);
  const datos = {};

  if (body.nombre_identificador || body.nombre) {
    datos.nombre_identificador = String(body.nombre_identificador || body.nombre).trim();
  }
  if (body.conjunto) {
    datos.conjunto = validarId(body.conjunto);
  }
  if (body.tipo_puesto || body.tipo) {
    const tp = body.tipo_puesto || body.tipo;
    if (!TIPOS_PUESTO.includes(tp)) throw new HttpError(400, `tipo_puesto inválido. Opciones: ${TIPOS_PUESTO.join(', ')}`);
    datos.tipo_puesto = tp;
  }
  if (body.descripcion !== undefined) datos.descripcion = String(body.descripcion).trim();
  if (body.activo !== undefined) datos.activo = Boolean(body.activo);

  if (!parcial && (!datos.nombre_identificador || !datos.conjunto)) {
    throw new HttpError(400, 'Para actualización completa se requieren nombre_identificador y conjunto');
  }

  const p = await Puesto.findByIdAndUpdate(id, datos, { new: true, runValidators: true }).populate('conjunto', 'nombre_conjunto nit direccion');
  if (!p) throw new HttpError(404, 'Puesto no encontrado');
  return p;
};

export const dbDeletePuesto = async (id) => {
  const p = await Puesto.findByIdAndDelete(validarId(id));
  if (!p) throw new HttpError(404, 'Puesto no encontrado');
  return p;
};
