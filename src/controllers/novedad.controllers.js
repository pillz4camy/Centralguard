import {
  createNovedadService,
  getNovedadesService,
  getNovedadByIdService,
  updateNovedadService,
  deleteNovedadService
} from '../services/novedad.services.js';

export const createNovedad = async (req, res) => 
  res.status(201).json(await createNovedadService(req.body));

export const getNovedades = async (req, res) => 
  res.status(200).json(await getNovedadesService(req.query));

export const getNovedadById = async (req, res) => 
  res.status(200).json(await getNovedadByIdService(req.params.id));

export const updateNovedad = async (req, res) => 
  res.status(200).json(await updateNovedadService(req.params.id, req.body, false));

export const patchNovedad = async (req, res) => 
  res.status(200).json(await updateNovedadService(req.params.id, req.body, true));

export const deleteNovedad = async (req, res) => {
  await deleteNovedadService(req.params.id);
  res.status(200).json({ message: 'Novedad eliminada correctamente' });
};
