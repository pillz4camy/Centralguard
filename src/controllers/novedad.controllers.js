import mongoose from 'mongoose';
import {
  createNovedadService,
  getNovedadesService,
  getNovedadByIdService,
  updateNovedadService,
  deleteNovedadService
} from '../services/novedad.services.js';

export const createNovedad = async (req, res) => {
  try {
    const novedad = await createNovedadService(req.body);
    res.status(201).json({ success: true, data: novedad });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getNovedades = async (req, res) => {
  try {
    const novedades = await getNovedadesService();
    res.status(200).json({ success: true, data: novedades });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getNovedadById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        success: false, 
        message: 'El ID proporcionado no tiene un formato válido' 
      });
    }

    const novedad = await getNovedadByIdService(id);
    if (!novedad) {
      return res.status(404).json({ success: false, message: 'Novedad no encontrada' });
    }
    res.status(200).json({ success: true, data: novedad });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateNovedad = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        success: false, 
        message: 'El ID proporcionado no tiene un formato válido' 
      });
    }

    const { hora_reporte, descripcion_hechos } = req.body;
    if (!hora_reporte || !descripcion_hechos) {
      return res.status(400).json({ 
        success: false, 
        message: 'Faltan campos obligatorios (hora_reporte y descripcion_hechos son requeridos para actualizar)' 
      });
    }

    const novedad = await updateNovedadService(id, req.body);
    if (!novedad) {
      return res.status(404).json({ success: false, message: 'Novedad no encontrada' });
    }
    res.status(200).json({ success: true, data: novedad });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteNovedad = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        success: false, 
        message: 'El ID proporcionado no tiene un formato válido' 
      });
    }

    const novedad = await deleteNovedadService(id);
    if (!novedad) {
      return res.status(404).json({ success: false, message: 'Novedad no encontrada' });
    }
    res.status(200).json({ success: true, message: 'Novedad eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};