import mongoose from 'mongoose';
import Conjunto from '../model/conjunto.model.js';
import { HttpError } from '../middleware/errors.js';

const validarId = (id) => {
  if (!mongoose.isValidObjectId(id)) throw new HttpError(400, 'El id no es válido');
  return String(id);
};

export const crearConjunto = async (body) => {
  const { nombre_conjunto, nit, direccion, correo_electronico, telefono, contacto_principal, activo } = body || {};

  if (!nombre_conjunto || !direccion) {
    throw new HttpError(400, 'nombre_conjunto y direccion son obligatorios');
  }

  if (nit) {
    const existe = await Conjunto.findOne({ nit: String(nit).trim() });
    if (existe) throw new HttpError(400, 'Ya existe un conjunto registrado con este NIT');
  }

  return Conjunto.create({
    nombre_conjunto: String(nombre_conjunto).trim(),
    nit: nit ? String(nit).trim() : undefined,
    direccion: String(direccion).trim(),
    correo_electronico: correo_electronico ? String(correo_electronico).toLowerCase().trim() : '',
    telefono: telefono || undefined,
    contacto_principal: contacto_principal || undefined,
    activo: activo !== undefined ? Boolean(activo) : true
  });
};

export const listarConjuntos = async (query = {}) => {
  const filtro = {};
  if (query.activo !== undefined) filtro.activo = query.activo === 'true';
  if (query.nombre) filtro.nombre_conjunto = new RegExp(String(query.nombre).trim(), 'i');

  return Conjunto.find(filtro).sort({ nombre_conjunto: 1 });
};

export const obtenerConjunto = async (id) => {
  const c = await Conjunto.findById(validarId(id));
  if (!c) throw new HttpError(404, 'Conjunto no encontrado');
  return c;
};

export const actualizarConjunto = async (id, body) => {
  validarId(id);
  const datos = {};
  if (body.nombre_conjunto) datos.nombre_conjunto = String(body.nombre_conjunto).trim();
  if (body.nit !== undefined) datos.nit = body.nit ? String(body.nit).trim() : undefined;
  if (body.direccion) datos.direccion = String(body.direccion).trim();
  if (body.correo_electronico !== undefined) datos.correo_electronico = String(body.correo_electronico).toLowerCase().trim();
  if (body.telefono !== undefined) datos.telefono = body.telefono;
  if (body.contacto_principal !== undefined) datos.contacto_principal = body.contacto_principal;
  if (body.activo !== undefined) datos.activo = Boolean(body.activo);

  const c = await Conjunto.findByIdAndUpdate(id, datos, { new: true, runValidators: true });
  if (!c) throw new HttpError(404, 'Conjunto no encontrado');
  return c;
};

export const eliminarConjunto = async (id) => {
  const c = await Conjunto.findByIdAndDelete(validarId(id));
  if (!c) throw new HttpError(404, 'Conjunto no encontrado');
  return c;
};
