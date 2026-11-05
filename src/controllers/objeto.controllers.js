import * as service from '../services/objeto.services.js';

export const getObjetos = async (req, res) => res.status(200).json(await service.listar(req.query));
export const getObjeto = async (req, res) => res.status(200).json(await service.obtener(req.params.id));
export const crearObjeto = async (req, res) => res.status(201).json(await service.crear(req.body));
export const actualizarObjeto = async (req, res) => res.status(200).json(await service.actualizar(req.params.id, req.body));
export const eliminarObjeto = async (req, res) => {
  await service.eliminar(req.params.id);
  res.status(200).json({ message: 'Objeto eliminado correctamente' });
};