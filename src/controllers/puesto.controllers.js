import {
  dbGetPuestos, dbGetPuesto, dbCreatePuesto, dbUpdatePuesto, dbDeletePuesto,
} from '../services/puesto.services.js';

// Express 5 captura automáticamente los errores de funciones async
export const getPuestos = async (req, res) => res.status(200).json(await dbGetPuestos(req.query));

export const getPuesto = async (req, res) => res.status(200).json(await dbGetPuesto(req.params.id));

export const registrarPuesto = async (req, res) => res.status(201).json(await dbCreatePuesto(req.body));

export const actualizarPuesto = async (req, res) =>
  res.status(200).json(await dbUpdatePuesto(req.params.id, req.body, false));

export const actualizarParcialPuesto = async (req, res) =>
  res.status(200).json(await dbUpdatePuesto(req.params.id, req.body, true));

export const eliminarPuesto = async (req, res) => {
  const puesto = await dbDeletePuesto(req.params.id);
  res.status(200).json({ message: 'Puesto eliminado', puesto });
};
