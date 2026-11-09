import mongoose from 'mongoose';
import Objeto, { ESTADOS_OBJETO } from '../model/objeto.model.js';
import { HttpError } from '../middleware/errors.js';

const validarId = (id) => {
  if (!mongoose.isValidObjectId(id)) throw new HttpError(400, 'El id no es válido');
  return String(id);
};

export const listar = async (query = {}) => {
  const filtro = {};
  if (query.estado) {
    if (!ESTADOS_OBJETO.includes(query.estado)) throw new HttpError(400, 'Estado inválido');
    filtro.estado = query.estado;
  }
  if (query.puesto) filtro.puesto_vigilancia = validarId(query.puesto);

  return Objeto.find(filtro).populate('puesto_vigilancia', 'nombre_identificador tipo_puesto').sort({ createdAt: -1 });
};

export const obtener = async (id) => {
  const obj = await Objeto.findById(validarId(id)).populate('puesto_vigilancia', 'nombre_identificador tipo_puesto');
  if (!obj) throw new HttpError(404, 'Objeto no encontrado');
  return obj;
};

export const crear = async (body) => {
  const nombre_objeto = body.nombre_objeto || body.nombre;
  const descripcion_detallada = body.descripcion_detallada || body.descripcion || '';
  const puesto_vigilancia = body.puesto_vigilancia || body.puesto || null;
  const fecha_hallazgo = body.fecha_hallazgo ? new Date(body.fecha_hallazgo) : new Date();
  const estado = body.estado && ESTADOS_OBJETO.includes(body.estado) ? body.estado : 'en_custodia';
  const evidencias = Array.isArray(body.evidencias) ? body.evidencias : [];

  if (!nombre_objeto) throw new HttpError(400, 'El nombre del objeto es obligatorio');
  if (puesto_vigilancia) validarId(puesto_vigilancia);

  const obj = await Objeto.create({
    puesto_vigilancia,
    nombre_objeto: String(nombre_objeto).trim(),
    descripcion_detallada: String(descripcion_detallada).trim(),
    fecha_hallazgo,
    evidencias,
    estado
  });

  return Objeto.findById(obj._id).populate('puesto_vigilancia', 'nombre_identificador tipo_puesto');
};

export const actualizar = async (id, body) => {
  validarId(id);
  const datos = {};
  if (body.nombre_objeto || body.nombre) datos.nombre_objeto = String(body.nombre_objeto || body.nombre).trim();
  if (body.descripcion_detallada || body.descripcion !== undefined) {
    datos.descripcion_detallada = String(body.descripcion_detallada || body.descripcion).trim();
  }
  if (body.puesto_vigilancia) datos.puesto_vigilancia = validarId(body.puesto_vigilancia);
  if (body.fecha_hallazgo) datos.fecha_hallazgo = new Date(body.fecha_hallazgo);
  if (body.entregado_a !== undefined) datos.entregado_a = body.entregado_a ? String(body.entregado_a).trim() : null;
  if (body.fecha_entrega !== undefined) datos.fecha_entrega = body.fecha_entrega ? new Date(body.fecha_entrega) : null;
  if (body.evidencias !== undefined && Array.isArray(body.evidencias)) datos.evidencias = body.evidencias;
  if (body.estado) {
    if (!ESTADOS_OBJETO.includes(body.estado)) throw new HttpError(400, 'Estado inválido');
    datos.estado = body.estado;
    if (body.estado === 'entregado' && !datos.fecha_entrega) {
      datos.fecha_entrega = new Date();
    }
  }

  const obj = await Objeto.findByIdAndUpdate(id, datos, { new: true, runValidators: true })
    .populate('puesto_vigilancia', 'nombre_identificador tipo_puesto');

  if (!obj) throw new HttpError(404, 'Objeto no encontrado');
  return obj;
};

export const eliminar = async (id) => {
  const obj = await Objeto.findByIdAndDelete(validarId(id));
  if (!obj) throw new HttpError(404, 'Objeto no encontrado');
  return obj;
};
