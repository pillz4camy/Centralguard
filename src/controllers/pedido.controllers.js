import mongoose from 'mongoose';
import {
  createPedidoService,
  getPedidosService,
  getPedidoByIdService,
  updatePedidoService,
  deletePedidoService
} from '../services/pedido.services.js';

export const createPedido = async (req, res) => {
  try {
    const { nombre_pedido, descripcion, nombre_destinatario, hora_llegada, estado } = req.body;

    if (!nombre_pedido || !descripcion || !nombre_destinatario || !hora_llegada || !estado) {
      return res.status(400).json({ 
        success: false, 
        message: 'Faltan campos obligatorios (nombre_pedido, descripcion, nombre_destinatario, hora_llegada y estado son requeridos)' 
      });
    }

    const pedido = await createPedidoService(req.body);
    return res.status(201).json({ success: true, data: pedido });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getPedidos = async (req, res) => {
  try {
    const pedidos = await getPedidosService();
    return res.status(200).json({ success: true, data: pedidos });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getPedidoById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        success: false, 
        message: 'El ID proporcionado no tiene un formato válido' 
      });
    }

    const pedido = await getPedidoByIdService(id);
    if (!pedido) {
      return res.status(404).json({ success: false, message: 'Pedido no encontrado' });
    }
    return res.status(200).json({ success: true, data: pedido });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// PUT: Actualización completa (exige TODOS los campos obligatorios)
export const updatePedido = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        success: false, 
        message: 'El ID proporcionado no tiene un formato válido' 
      });
    }

    const { nombre_pedido, descripcion, nombre_destinatario, hora_llegada, estado } = req.body;
    
    if (!nombre_pedido || !descripcion || !nombre_destinatario || !hora_llegada || !estado) {
      return res.status(400).json({ 
        success: false, 
        message: 'Para PUT se requieren obligatoriamente nombre_pedido, descripcion, nombre_destinatario, hora_llegada y estado' 
      });
    }

    const pedido = await updatePedidoService(id, req.body);
    if (!pedido) {
      return res.status(404).json({ success: false, message: 'Pedido no encontrado' });
    }
    
    return res.status(200).json({ success: true, data: pedido });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// PATCH: Actualización parcial (permite enviar solo el campo que desees modificar)
export const patchPedido = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        success: false, 
        message: 'El ID proporcionado no tiene un formato válido' 
      });
    }

    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'No se enviaron datos para actualizar' 
      });
    }

    const pedido = await updatePedidoService(id, req.body);
    if (!pedido) {
      return res.status(404).json({ success: false, message: 'Pedido no encontrado' });
    }
    
    return res.status(200).json({ success: true, data: pedido });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const deletePedido = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        success: false, 
        message: 'El ID proporcionado no tiene un formato válido' 
      });
    }

    const pedido = await deletePedidoService(id);
    if (!pedido) {
      return res.status(404).json({ success: false, message: 'Pedido no encontrado' });
    }
    return res.status(200).json({ success: true, message: 'Pedido eliminado correctamente' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};