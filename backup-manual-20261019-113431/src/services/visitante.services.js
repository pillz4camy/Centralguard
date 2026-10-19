import Visitante from '../models/visitante.model.js';
import { HttpError } from '../middleware/errors.js';
import { limpiar, validarId, escaparRegex, REGEX } from '../middleware/validar.js';
import { esGestion } from '../middleware/auth.js';

const reglas = {
  nombre: { req: true, max: 100 },
  documento: { regex: REGEX.documento, msg: 'documento debe tener 5-20 letras, números, punto o guion' },
  destino: { req: true, max: 100 },
  placa: { upper: true, regex: REGEX.placa, msg: 'placa inválida (5-8 letras, números o guion)' },
  observaciones: { max: 255 },
};

const fecha = (v, campo) => {
  const d = new Date(v);
  if (typeof v !== 'string' || Number.isNaN(d.getTime())) throw new HttpError(400, `${campo} debe ser una fecha válida (ej: 2026-10-19)`);
  return d;
};

// El vigilante solo ve/modifica sus propios registros; supervisor y administrador, todos.
async function cargarConPermiso(id, user) {
  const v = await Visitante.findById(validarId(id));
  if (!v) throw new HttpError(404, 'Registro no encontrado');
  if (!esGestion(user) && v.idusuario !== user.idusuario) throw new HttpError(403, 'Ese registro pertenece a otro vigilante');
  return v;
}

export const crear = (body, user) => Visitante.create({ ...limpiar(body, reglas), idusuario: user.idusuario });

export async function listar(query = {}, user) {
  const filtro = {};
  if (esGestion(user)) {
    if (query.idusuario !== undefined) {
      if (typeof query.idusuario !== 'string') throw new HttpError(400, 'idusuario debe ser texto');
      filtro.idusuario = query.idusuario;
    }
  } else {
    filtro.idusuario = user.idusuario;
  }
  if (query.placa !== undefined) {
    if (typeof query.placa !== 'string') throw new HttpError(400, 'placa debe ser texto');
    filtro.placa = query.placa.trim().toUpperCase();
  }
  if (query.en_sitio !== undefined) {
    if (!['true', 'false'].includes(query.en_sitio)) throw new HttpError(400, 'en_sitio debe ser true o false');
    filtro.fecha_salida = query.en_sitio === 'true' ? null : { $ne: null };
  }
  if (query.desde !== undefined || query.hasta !== undefined) {
    filtro.fecha_ingreso = {};
    if (query.desde !== undefined) filtro.fecha_ingreso.$gte = fecha(query.desde, 'desde');
    if (query.hasta !== undefined) filtro.fecha_ingreso.$lte = fecha(query.hasta, 'hasta');
  }
  if (query.q !== undefined) {
    if (typeof query.q !== 'string') throw new HttpError(400, 'q debe ser texto');
    if (query.q.trim()) {
      const rx = new RegExp(escaparRegex(query.q.trim()), 'i');
      filtro.$or = [{ nombre: rx }, { destino: rx }, { documento: rx }];
    }
  }
  const limit = Math.min(Math.max(parseInt(query.limit, 10) || 100, 1), 500);
  const skip = (Math.max(parseInt(query.page, 10) || 1, 1) - 1) * limit;
  return Visitante.find(filtro).sort({ fecha_ingreso: -1 }).skip(skip).limit(limit);
}

export const obtener = (id, user) => cargarConPermiso(id, user);

export async function actualizar(id, body, user) {
  await cargarConPermiso(id, user);
  const datos = limpiar(body, reglas, true);
  return Visitante.findByIdAndUpdate(validarId(id), datos, { returnDocument: 'after', runValidators: true });
}

export async function registrarSalida(id, user) {
  await cargarConPermiso(id, user);
  // Atómico: solo marca la salida si todavía no se había registrado
  const v = await Visitante.findOneAndUpdate({ _id: validarId(id), fecha_salida: null }, { fecha_salida: new Date() }, { returnDocument: 'after' });
  if (!v) throw new HttpError(400, 'Este visitante ya tiene salida registrada');
  return v;
}

export async function eliminar(id) {
  const v = await Visitante.findByIdAndDelete(validarId(id));
  if (!v) throw new HttpError(404, 'Registro no encontrado');
  return v;
}
