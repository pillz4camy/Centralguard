import * as service from '../services/user.services.js';

export const registrar = async (req, res) => {
  const esAdmin = req.user?.rol === 'administrador';
  res.status(201).json(await service.registrar(req.body, esAdmin));
};

export const login = async (req, res) => res.status(200).json(await service.login(req.body));

export const perfil = async (req, res) => res.status(200).json(await service.perfil(req.user.id || req.user.idusuario));

export const listar = async (req, res) => res.status(200).json(await service.listar(req.query));

export const actualizar = async (req, res) => res.status(200).json(await service.actualizar(req.params.id, req.body));

export const eliminar = async (req, res) => {
  await service.eliminar(req.params.id);
  res.status(200).json({ message: 'Usuario eliminado correctamente' });
};
