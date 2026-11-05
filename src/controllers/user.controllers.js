import * as service from '../services/user.services.js';

export const registrar = async (req, res) => res.status(201).json(await service.registrar(req.body));
export const login = async (req, res) => res.status(200).json(await service.login(req.body));
export const perfil = async (req, res) => res.status(200).json(await service.perfil(req.user.id));
export const listar = async (req, res) => res.status(200).json(await service.listar());
export const actualizar = async (req, res) => res.status(200).json(await service.actualizar(req.params.id, req.body));
export const eliminar = async (req, res) => {
  await service.eliminar(req.params.id);
  res.status(200).json({ message: 'Usuario eliminado correctamente' });
};