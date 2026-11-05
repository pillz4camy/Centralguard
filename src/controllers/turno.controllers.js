import { crearTurno, listarTurnos, obtenerTurno, actualizarTurno, eliminarTurno } from '../services/turno.services.js';

export const getTurnos = async (req, res) => res.status(200).json(await listarTurnos(req.query));
export const getTurno = async (req, res) => res.status(200).json(await obtenerTurno(req.params.id));
export const registrarTurno = async (req, res) => res.status(201).json(await crearTurno(req.body));
export const updateTurno = async (req, res) => res.status(200).json(await actualizarTurno(req.params.id, req.body));
export const deleteTurno = async (req, res) => {
  const t = await eliminarTurno(req.params.id);
  res.status(200).json({ message: 'Turno eliminado', turno: t });
};