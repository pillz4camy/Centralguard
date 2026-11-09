import mongoose from 'mongoose';
import Pedido, { ESTADOS_PEDIDO } from '../model/pedido.model.js';
import { HttpError } from '../middleware/errors.js';

const validarId = (id) => {
  if (!mongoose.isValidObjectId(id)) throw new HttpError(400, 'El id no es válido');
  return String(id);
};

export const createPedidoService = async (body) => {
  const { registro_acceso, nombre_pedido, descripcion, nombre_destinatario, apartamento_destino, hora_llegada, hora_entrega, estado } = body || {};

  if (!nombre_pedido || !nombre_destinatario || !apartamento_destino) {
    throw new HttpError(400, 'nombre_pedido, nombre_destinatario y apartamento_destino son obligatorios');
  }

  if (registro_acceso) validarId(registro_acceso);

  const est = estado && ESTADOS_PEDIDO.includes(estado) ? estado : 'Pendiente';

  const p = await Pedido.create({
    registro_acceso: registro_acceso || null,
    nombre_pedido: String(nombre_pedido).trim(),
    descripcion: descripcion ? String(descripcion).trim() : '',
    nombre_destinatario: String(nombre_destinatario).trim(),
    apartamento_destino: String(apartamento_destino).trim(),
    hora_llegada: hora_llegada ? new Date(hora_llegada) : new Date(),
    hora_entrega: hora_entrega ? new Date(hora_entrega) : null,
    estado: est
  });

  return Pedido.findById(p._id).populate('registro_acceso');
};

export const getPedidosService = async (query = {}) => {
  const filtro = {};
  if (query.estado) {
    if (!ESTADOS_PEDIDO.includes(query.estado)) throw new HttpError(400, 'Estado inválido');
    filtro.estado = query.estado;
  }
  if (query.apartamento) filtro.apartamento_destino = String(query.apartamento).trim();

  return Pedido.find(filtro).populate('registro_acceso').sort({ hora_llegada: -1 });
};

export const getPedidoByIdService = async (id) => {
  const p = await Pedido.findById(validarId(id)).populate('registro_acceso');
  if (!p) throw new HttpError(404, 'Pedido no encontrado');
  return p;
};

export const updatePedidoService = async (id, body, parcial = false) => {
  validarId(id);
  const datos = {};

  if (body.registro_acceso !== undefined) {
    datos.registro_acceso = body.registro_acceso ? validarId(body.registro_acceso) : null;
  }
  if (body.nombre_pedido !== undefined) datos.nombre_pedido = String(body.nombre_pedido).trim();
  if (body.descripcion !== undefined) datos.descripcion = String(body.descripcion).trim();
  if (body.nombre_destinatario !== undefined) datos.nombre_destinatario = String(body.nombre_destinatario).trim();
  if (body.apartamento_destino !== undefined) datos.apartamento_destino = String(body.apartamento_destino).trim();
  if (body.hora_llegada !== undefined) datos.hora_llegada = new Date(body.hora_llegada);
  if (body.hora_entrega !== undefined) datos.hora_entrega = body.hora_entrega ? new Date(body.hora_entrega) : null;
  if (body.estado !== undefined) {
    if (!ESTADOS_PEDIDO.includes(body.estado)) throw new HttpError(400, 'Estado de pedido inválido');
    datos.estado = body.estado;
    if (body.estado === 'Entregado' && !datos.hora_entrega) {
      datos.hora_entrega = new Date();
    }
  }

  if (!parcial && (!datos.nombre_pedido || !datos.nombre_destinatario || !datos.apartamento_destino)) {
    throw new HttpError(400, 'Para PUT se requieren nombre_pedido, nombre_destinatario y apartamento_destino');
  }

  const p = await Pedido.findByIdAndUpdate(id, datos, { new: true, runValidators: true }).populate('registro_acceso');
  if (!p) throw new HttpError(404, 'Pedido no encontrado');
  return p;
};

export const deletePedidoService = async (id) => {
  const p = await Pedido.findByIdAndDelete(validarId(id));
  if (!p) throw new HttpError(404, 'Pedido no encontrado');
  return p;
};
