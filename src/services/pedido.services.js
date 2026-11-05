import mongoose from 'mongoose';
import Pedido, { ESTADOS_PEDIDO } from '../model/pedido.model.js';
import { HttpError } from '../middleware/errors.js';

const validarId = (id) => {
  if (!mongoose.isValidObjectId(id)) throw new HttpError(400, 'El id no es válido');
  return String(id);
};

export const createPedidoService = async (body) => {
  const { nombre_pedido, descripcion, nombre_destinatario, hora_llegada, estado } = body || {};
  if (!nombre_pedido || !descripcion || !nombre_destinatario || !hora_llegada) {
    throw new HttpError(400, 'Faltan campos obligatorios para registrar el pedido');
  }

  return Pedido.create({
    nombre_pedido: String(nombre_pedido).trim(),
    descripcion: String(descripcion).trim(),
    nombre_destinatario: String(nombre_destinatario).trim(),
    hora_llegada: String(hora_llegada).trim(),
    estado: estado && ESTADOS_PEDIDO.includes(estado) ? estado : 'Pendiente'
  });
};

export const getPedidosService = async () => Pedido.find().sort({ createdAt: -1 });

export const getPedidoByIdService = async (id) => {
  const p = await Pedido.findById(validarId(id));
  if (!p) throw new HttpError(404, 'Pedido no encontrado');
  return p;
};

export const updatePedidoService = async (id, body, parcial = false) => {
  validarId(id);
  const datos = {};

  if (body.nombre_pedido !== undefined) datos.nombre_pedido = String(body.nombre_pedido).trim();
  if (body.descripcion !== undefined) datos.descripcion = String(body.descripcion).trim();
  if (body.nombre_destinatario !== undefined) datos.nombre_destinatario = String(body.nombre_destinatario).trim();
  if (body.hora_llegada !== undefined) datos.hora_llegada = String(body.hora_llegada).trim();
  if (body.estado !== undefined) {
    if (!ESTADOS_PEDIDO.includes(body.estado)) throw new HttpError(400, 'Estado de pedido inválido');
    datos.estado = body.estado;
  }

  if (!parcial && (!datos.nombre_pedido || !datos.descripcion || !datos.nombre_destinatario || !datos.hora_llegada || !datos.estado)) {
    throw new HttpError(400, 'Para PUT se requieren todos los campos obligatorios del pedido');
  }

  const p = await Pedido.findByIdAndUpdate(id, datos, { new: true, runValidators: true });
  if (!p) throw new HttpError(404, 'Pedido no encontrado');
  return p;
};

export const deletePedidoService = async (id) => {
  const p = await Pedido.findByIdAndDelete(validarId(id));
  if (!p) throw new HttpError(404, 'Pedido no encontrado');
  return p;
};