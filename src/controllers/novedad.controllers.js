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
    const { hora_reporte, descripcion_hechos, estado } = req.body;

    // Validamos que se incluyan todos los campos obligatorios, incluido el estado
    if (!hora_reporte || !descripcion_hechos || !estado) {
      return res.status(400).json({ 
        success: false, 
        message: 'Faltan campos obligatorios (hora_reporte, descripcion_hechos y estado son requeridos)' 
      });
    }

    const novedad = await createNovedadService(req.body);
    return res.status(201).json({ success: true, data: novedad });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getNovedades = async (req, res) => {
  try {
    const novedades = await getNovedadesService();
    return res.status(200).json({ success: true, data: novedades });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
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
    return res.status(200).json({ success: true, data: novedad });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// PUT: Actualización completa (exige TODOS los campos obligatorios: hora, descripción y estado)
export const updateNovedad = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        success: false, 
        message: 'El ID proporcionado no tiene un formato válido' 
      });
    }

    const { hora_reporte, descripcion_hechos, estado } = req.body;
    
    if (!hora_reporte || !descripcion_hechos || !estado) {
      return res.status(400).json({ 
        success: false, 
        message: 'Para PUT se requieren obligatoriamente hora_reporte, descripcion_hechos y estado' 
      });
    }

    const novedad = await updateNovedadService(id, req.body);
    if (!novedad) {
      return res.status(404).json({ success: false, message: 'Novedad no encontrada' });
    }
    
    return res.status(200).json({ success: true, data: novedad });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const patchNovedad = async (req, res) => {
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

    const novedad = await updateNovedadService(id, req.body);
    if (!novedad) {
      return res.status(404).json({ success: false, message: 'Novedad no encontrada' });
    }
    
    return res.status(200).json({ success: true, data: novedad });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
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
    return res.status(200).json({ success: true, message: 'Novedad eliminada correctamente' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};