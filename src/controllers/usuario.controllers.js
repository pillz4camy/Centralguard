import { listar, conteoPendientes, obtener, actualizar, cambiarEstado, eliminar } from '../services/usuario.services.js';

export const getUsuarios = async (req, res) => res.status(200).json(await listar(req.query));
export const getConteoPendientes = async (req, res) => res.status(200).json(await conteoPendientes());
export const getUsuario = async (req, res) => res.status(200).json(await obtener(req.params.id));
export const actualizarUsuario = async (req, res) => res.status(200).json(await actualizar(req.params.id, req.body, req.user));
export const cambiarEstadoUsuario = async (req, res) => res.status(200).json(await cambiarEstado(req.params.id, req.body, req.user));
export const eliminarUsuario = async (req, res) =>
  res.status(200).json({ message: 'Usuario eliminado', usuario: await eliminar(req.params.id, req.user) });
