import * as service from '../services/persona_acceso.services.js';

export const listar = async (req, res) => res.status(200).json(await service.listar(req.query));
export const obtener = async (req, res) => res.status(200).json(await service.obtener(req.params.id));
export const crear = async (req, res) => res.status(201).json(await service.crear(req.body));
export const actualizar = async (req, res) => res.status(200).json(await service.actualizar(req.params.id, req.body));
export const eliminar = async (req, res) => {
  await service.eliminar(req.params.id);
  res.status(200).json({ message: 'Persona de acceso eliminada correctamente' });
};