import Objeto, { ESTADOS } from '../models/objeto.model.js';
import { HttpError } from '../middleware/errors.js';
import { limpiar, validarId, escaparRegex, fechaValida } from '../middleware/validar.js';
import { esGestion } from '../middleware/auth.js';

const reglas = {
  articulo: { req: true, max: 100 },
  descripcion: { max: 255 },
  ubicacion_hallazgo: { max: 150 },
  estado: { enum: ESTADOS },
  entregado_a: { max: 100 },
};

// El vigilante solo ve/modifica sus propios registros; supervisor y administrador, todos.
async function cargarConPermiso(id, user) {
  const o = await Objeto.findById(validarId(id));
  if (!o) throw new HttpError(404, 'Objeto no encontrado');
  if (!esGestion(user) && o.idusuario !== user.idusuario) throw new HttpError(403, 'Ese objeto lo registró otro vigilante');
  return o;
}

// Coherencia estado <-> entregado_a / fecha_entrega
function aplicarEstado(datos, actual = { estado: 'en_custodia' }) {
  const estadoFinal = datos.estado ?? actual.estado;
  if (estadoFinal === 'entregado') {
    if (actual.estado !== 'entregado') datos.fecha_entrega = new Date(); // pasó a entregado ahora
  } else {
    if (datos.entregado_a) throw new HttpError(400, 'Un objeto en custodia no puede tener entregado_a (cambia el estado a entregado)');
    if (datos.estado === 'en_custodia' && actual.estado === 'entregado') { datos.entregado_a = ''; datos.fecha_entrega = null; }
  }
  return datos;
}

export const crear = (body, user) =>
  Objeto.create({ ...aplicarEstado(limpiar(body, reglas)), idusuario: user.idusuario });

function filtroBase(query, user) {
  const filtro = {};
  if (esGestion(user)) {
    if (query.idusuario !== undefined) {
      if (typeof query.idusuario !== 'string') throw new HttpError(400, 'idusuario debe ser texto');
      filtro.idusuario = query.idusuario;
    }
  } else {
    filtro.idusuario = user.idusuario;
  }
  return filtro;
}

export async function listar(query = {}, user) {
  const filtro = filtroBase(query, user);
  if (query.estado !== undefined) {
    if (!ESTADOS.includes(query.estado)) throw new HttpError(400, `estado debe ser uno de: ${ESTADOS.join(', ')}`);
    filtro.estado = query.estado;
  }
  if (query.desde !== undefined || query.hasta !== undefined) {
    filtro.fecha_registro = {};
    if (query.desde !== undefined) filtro.fecha_registro.$gte = fechaValida(query.desde, 'desde');
    if (query.hasta !== undefined) filtro.fecha_registro.$lte = fechaValida(query.hasta, 'hasta');
  }
  if (query.q !== undefined) {
    if (typeof query.q !== 'string') throw new HttpError(400, 'q debe ser texto');
    if (query.q.trim()) {
      const rx = new RegExp(escaparRegex(query.q.trim()), 'i');
      filtro.$or = [{ articulo: rx }, { ubicacion_hallazgo: rx }, { entregado_a: rx }, { descripcion: rx }];
    }
  }
  const limit = Math.min(Math.max(parseInt(query.limit, 10) || 100, 1), 500);
  const skip = (Math.max(parseInt(query.page, 10) || 1, 1) - 1) * limit;
  return Objeto.find(filtro).sort({ fecha_registro: -1 }).skip(skip).limit(limit);
}

// Contadores para los badges del panel (mismo alcance que el listado)
export async function resumen(query = {}, user) {
  const base = filtroBase(query, user);
  const [en_custodia, entregados] = await Promise.all([
    Objeto.countDocuments({ ...base, estado: 'en_custodia' }),
    Objeto.countDocuments({ ...base, estado: 'entregado' }),
  ]);
  return { en_custodia, entregados, total: en_custodia + entregados };
}

export const obtener = (id, user) => cargarConPermiso(id, user);

export async function actualizar(id, body, user) {
  const actual = await cargarConPermiso(id, user);
  const datos = aplicarEstado(limpiar(body, reglas, true), actual);
  return Objeto.findByIdAndUpdate(validarId(id), datos, { returnDocument: 'after', runValidators: true });
}

// Atajo: marcar como entregado (opcionalmente indicando a quién)
export async function entregar(id, body, user) {
  await cargarConPermiso(id, user);
  const { entregado_a } = limpiar(body ?? {}, { entregado_a: { max: 100 } });
  const cambios = { estado: 'entregado', fecha_entrega: new Date(), ...(entregado_a ? { entregado_a } : {}) };
  // Atómico: solo si todavía está en custodia
  const o = await Objeto.findOneAndUpdate({ _id: validarId(id), estado: 'en_custodia' }, cambios, { returnDocument: 'after', runValidators: true });
  if (!o) throw new HttpError(400, 'Este objeto ya fue entregado');
  return o;
}

export async function eliminar(id) {
  const o = await Objeto.findByIdAndDelete(validarId(id));
  if (!o) throw new HttpError(404, 'Objeto no encontrado');
  return o;
}
