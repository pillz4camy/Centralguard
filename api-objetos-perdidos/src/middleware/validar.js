import mongoose from 'mongoose';
import { HttpError } from './errors.js';

export const validarId = (id) => {
  if (!mongoose.isValidObjectId(id)) throw new HttpError(400, 'El id no es válido');
  return String(id);
};

export const escaparRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Toma SOLO los campos definidos en `reglas`, valida tipo/largo/formato y devuelve un objeto limpio.
// reglas = { campo: { tipo:'string'|'integer'|'boolean', req, min, max, regex, msg, enum, lower, upper } }
export function limpiar(body, reglas, parcial = false) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) throw new HttpError(400, 'El cuerpo debe ser un objeto JSON');
  const out = {};
  for (const [campo, r] of Object.entries(reglas)) {
    let v = body[campo];
    if (v === undefined) {
      if (!parcial && r.req) throw new HttpError(400, `${campo} es obligatorio`);
      continue;
    }
    const tipo = r.tipo || 'string';
    if (tipo === 'boolean') {
      if (typeof v !== 'boolean') throw new HttpError(400, `${campo} debe ser true o false`);
    } else if (tipo === 'integer') {
      if (!Number.isInteger(v)) throw new HttpError(400, `${campo} debe ser un número entero`);
    } else {
      if (typeof v !== 'string') throw new HttpError(400, `${campo} debe ser texto`);
      if (!r.sinTrim) v = v.trim();
      if (r.lower) v = v.toLowerCase();
      if (r.upper) v = v.toUpperCase();
      if (v === '') {
        if (r.req) throw new HttpError(400, `${campo} no puede estar vacío`);
        out[campo] = '';
        continue;
      }
      if (r.min && v.length < r.min) throw new HttpError(400, `${campo} debe tener al menos ${r.min} caracteres`);
      if (r.max && v.length > r.max) throw new HttpError(400, `${campo} no puede superar ${r.max} caracteres`);
      if (r.regex && !r.regex.test(v)) throw new HttpError(400, r.msg || `${campo} tiene un formato inválido`);
    }
    if (r.enum && !r.enum.includes(v)) throw new HttpError(400, `${campo} debe ser uno de: ${r.enum.join(', ')}`);
    out[campo] = v;
  }
  if (parcial && !Object.keys(out).length) throw new HttpError(400, 'No enviaste ningún campo para actualizar');
  return out;
}

export const fechaValida = (v, campo) => {
  const d = new Date(v);
  if (typeof v !== 'string' || Number.isNaN(d.getTime())) throw new HttpError(400, `${campo} debe ser una fecha válida (ej: 2026-10-19)`);
  return d;
};
