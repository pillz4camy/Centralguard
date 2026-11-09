import * as service from '../services/conjunto.services.js';

export const getConjuntos = async (req, res) => res.status(200).json(await service.listarConjuntos(req.query));

export const getConjunto = async (req, res) => res.status(200).json(await service.obtenerConjunto(req.params.id));

export const registrarConjunto = async (req, res) => res.status(201).json(await service.crearConjunto(req.body));

export const actualizarConjunto = async (req, res) => res.status(200).json(await service.actualizarConjunto(req.params.id, req.body));

export const eliminarConjunto = async (req, res) => {
  const c = await service.eliminarConjunto(req.params.id);
  res.status(200).json({ message: 'Conjunto eliminado correctamente', conjunto: c });
};
