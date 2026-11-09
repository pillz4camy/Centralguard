import {
  createPedidoService,
  getPedidosService,
  getPedidoByIdService,
  updatePedidoService,
  deletePedidoService
} from '../services/pedido.services.js';

export const createPedido = async (req, res) => 
  res.status(201).json(await createPedidoService(req.body));

export const getPedidos = async (req, res) => 
  res.status(200).json(await getPedidosService(req.query));

export const getPedidoById = async (req, res) => 
  res.status(200).json(await getPedidoByIdService(req.params.id));

export const updatePedido = async (req, res) => 
  res.status(200).json(await updatePedidoService(req.params.id, req.body, false));

export const patchPedido = async (req, res) => 
  res.status(200).json(await updatePedidoService(req.params.id, req.body, true));

export const deletePedido = async (req, res) => {
  await deletePedidoService(req.params.id);
  res.status(200).json({ message: 'Pedido eliminado correctamente' });
};
