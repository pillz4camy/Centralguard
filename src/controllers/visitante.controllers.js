import { crear, listar, obtener, actualizar, registrarSalida, eliminar } from '../services/visitante.services.js';

export const registrarVisitante = async (req, res) => res.status(201).json(await crear(req.body, req.user));
export const getVisitantes = async (req, res) => res.status(200).json(await listar(req.query, req.user));
export const getVisitante = async (req, res) => res.status(200).json(await obtener(req.params.id, req.user));
export const actualizarVisitante = async (req, res) => res.status(200).json(await actualizar(req.params.id, req.body, req.user));
export const salidaVisitante = async (req, res) => res.status(200).json(await registrarSalida(req.params.id, req.user));
export const eliminarVisitante = async (req, res) =>
  res.status(200).json({ message: 'Registro eliminado', visitante: await eliminar(req.params.id) });
