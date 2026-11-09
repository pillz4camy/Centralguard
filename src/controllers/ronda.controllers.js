import { crearRonda, listarRondas, obtenerRonda, actualizarRonda, eliminarRonda } from '../services/ronda.services.js';

export const getRondas = async (req, res) => res.status(200).json(await listarRondas(req.query));

export const getRonda = async (req, res) => res.status(200).json(await obtenerRonda(req.params.id));

export const registrarRonda = async (req, res) => res.status(201).json(await crearRonda(req.body));

export const updateRonda = async (req, res) => res.status(200).json(await actualizarRonda(req.params.id, req.body));

export const deleteRonda = async (req, res) => {
  const r = await eliminarRonda(req.params.id);
  res.status(200).json({ message: 'Ronda eliminada', ronda: r });
};
