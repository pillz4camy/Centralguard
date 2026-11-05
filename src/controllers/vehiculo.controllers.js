import {
  crearVehiculo, listarVehiculos, obtenerVehiculo, actualizarVehiculo, eliminarVehiculo,
} from '../services/vehiculo.services.js';

export const getVehiculos = async (req, res) => res.status(200).json(await listarVehiculos(req.query));
export const getVehiculo = async (req, res) => res.status(200).json(await obtenerVehiculo(req.params.id));
export const registrarVehiculo = async (req, res) => res.status(201).json(await crearVehiculo(req.body));
export const updateVehiculo = async (req, res) => res.status(200).json(await actualizarVehiculo(req.params.id, req.body));
export const deleteVehiculo = async (req, res) => {
  const v = await eliminarVehiculo(req.params.id);
  res.status(200).json({ message: 'Vehículo eliminado', vehiculo: v });
};