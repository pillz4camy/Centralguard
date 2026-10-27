import Pedido from '../model/pedido.model.js';

export const createPedidoService = async (data) => {
  return await Pedido.create(data);
};

export const getPedidosService = async () => {
  return await Pedido.find();
};

export const getPedidoByIdService = async (id) => {
  return await Pedido.findById(id);
};

export const updatePedidoService = async (id, data) => {
  return await Pedido.findByIdAndUpdate(id, data, { new: true });
};

export const deletePedidoService = async (id) => {
  return await Pedido.findByIdAndDelete(id);
};