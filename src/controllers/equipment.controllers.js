import * as service from '../services/equipment.services.js';

export const getEquipment = async (req, res) => res.status(200).json(await service.listar(req.query));
export const getEquipmentById = async (req, res) => res.status(200).json(await service.obtener(req.params.id));
export const createEquipment = async (req, res) => res.status(201).json(await service.crear(req.body));
export const updateEquipment = async (req, res) => res.status(200).json(await service.actualizar(req.params.id, req.body));
export const deleteEquipment = async (req, res) => {
  await service.eliminar(req.params.id);
  res.status(200).json({ message: 'Equipo eliminado correctamente' });
};