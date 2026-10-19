import Usuario, { ESTADOS, ROLES_USUARIO } from '../models/usuario.model.js';
import { HttpError } from '../middleware/errors.js';
import { limpiar, validarId, escaparRegex, REGEX } from '../middleware/validar.js';

export const publico = (u) => {
  const o = typeof u.toObject === 'function' ? u.toObject() : { ...u };
  delete o.contrasena;
  return o;
};

const reglasEdicion = {
  nombre: { req: true, max: 80 },
  apellido: { req: true, max: 80 },
  documento: { req: true, regex: REGEX.documento, msg: 'documento debe tener 5-20 letras, números, punto o guion' },
  correo: { req: true, lower: true, max: 254, regex: REGEX.correo, msg: 'El correo no tiene un formato válido' },
  telefono: { max: 20, regex: REGEX.telefono, msg: 'telefono tiene un formato inválido' },
  rol: { enum: ROLES_USUARIO },
  estado_registro: { enum: ESTADOS },
};

const noEsUnoMismo = (id, user, mensaje) => {
  if (String(id) === String(user.idusuario)) throw new HttpError(400, mensaje);
};

export async function listar(query = {}) {
  const filtro = {};
  for (const [campo, validos] of [['estado_registro', ESTADOS], ['rol', ROLES_USUARIO]]) {
    if (query[campo] === undefined) continue;
    if (!validos.includes(query[campo])) throw new HttpError(400, `${campo} debe ser uno de: ${validos.join(', ')}`);
    filtro[campo] = query[campo];
  }
  if (query.q !== undefined) {
    if (typeof query.q !== 'string') throw new HttpError(400, 'q debe ser texto');
    const rx = new RegExp(escaparRegex(query.q.trim()), 'i');
    if (query.q.trim()) filtro.$or = [{ nombre: rx }, { apellido: rx }, { correo: rx }, { documento: rx }];
  }
  const limit = Math.min(Math.max(parseInt(query.limit, 10) || 100, 1), 500);
  const skip = (Math.max(parseInt(query.page, 10) || 1, 1) - 1) * limit;
  const lista = await Usuario.find(filtro).sort({ createdAt: -1 }).skip(skip).limit(limit);
  return lista.map(publico);
}

export const conteoPendientes = async () => ({ pendientes: await Usuario.countDocuments({ estado_registro: 'pendiente' }) });

export async function obtener(id) {
  const u = await Usuario.findById(validarId(id));
  if (!u) throw new HttpError(404, 'Usuario no encontrado');
  return publico(u);
}

export async function actualizar(id, body, user) {
  const datos = limpiar(body, reglasEdicion, true);
  if (datos.rol) noEsUnoMismo(id, user, 'No puedes cambiar tu propio rol');
  if (datos.estado_registro && datos.estado_registro !== 'aprobado') noEsUnoMismo(id, user, 'No puedes desaprobar tu propia cuenta');
  const u = await Usuario.findByIdAndUpdate(validarId(id), datos, { returnDocument: 'after', runValidators: true });
  if (!u) throw new HttpError(404, 'Usuario no encontrado');
  return publico(u);
}

// Aprobar o rechazar un registro pendiente (y, opcionalmente, asignar el rol)
export async function cambiarEstado(id, body, user) {
  const datos = limpiar(body, { estado_registro: { req: true, enum: ESTADOS }, rol: { enum: ROLES_USUARIO } });
  if (datos.estado_registro !== 'aprobado') noEsUnoMismo(id, user, 'No puedes desaprobar tu propia cuenta');
  if (datos.rol) noEsUnoMismo(id, user, 'No puedes cambiar tu propio rol');
  const u = await Usuario.findByIdAndUpdate(validarId(id), datos, { returnDocument: 'after', runValidators: true });
  if (!u) throw new HttpError(404, 'Usuario no encontrado');
  return publico(u);
}

export async function eliminar(id, user) {
  noEsUnoMismo(id, user, 'No puedes eliminar tu propia cuenta');
  const u = await Usuario.findByIdAndDelete(validarId(id));
  if (!u) throw new HttpError(404, 'Usuario no encontrado');
  return publico(u);
}
