import { crear, listar, resumen, obtener, actualizar, entregar, eliminar } from '../services/objeto.services.js';

export const registrarObjeto = async (req, res) => res.status(201).json(await crear(req.body, req.user));
export const getObjetos = async (req, res) => res.status(200).json(await listar(req.query, req.user));
export const getResumen = async (req, res) => res.status(200).json(await resumen(req.query, req.user));
export const getObjeto = async (req, res) => res.status(200).json(await obtener(req.params.id, req.user));
export const actualizarObjeto = async (req, res) => res.status(200).json(await actualizar(req.params.id, req.body, req.user));
export const entregarObjeto = async (req, res) => res.status(200).json(await entregar(req.params.id, req.body, req.user));
export const eliminarObjeto = async (req, res) =>
  res.status(200).json({ message: 'Objeto eliminado', objeto: await eliminar(req.params.id) });
