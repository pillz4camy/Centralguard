import mongoose from 'mongoose';
import Vehiculo from '../model/vehiculo.model.js';
import { HttpError } from '../middleware/errors.js';

const validarId = (id) => {
  if (!mongoose.isValidObjectId(id)) throw new HttpError(400, 'El id no es válido');
  return String(id);
};

export const crearVehiculo = async (body) => {
  const { placa, tipo, marca, modelo, color } = body || {};
  if (!placa) throw new HttpError(400, 'La placa es obligatoria');

  return Vehiculo.create({
    placa: String(placa).trim().toUpperCase(),
    tipo: tipo || 'automóvil',
    marca: marca ? String(marca).trim() : '',
    modelo: modelo ? String(modelo).trim() : '',
    color: color ? String(color).trim() : '',
  });
};

export const listarVehiculos = async (query = {}) => {
  const filtro = {};
  if (query.placa) {
    if (typeof query.placa !== 'string') throw new HttpError(400, 'placa debe ser texto');
    filtro.placa = new RegExp(query.placa.trim().toUpperCase(), 'i');
  }
  if (query.tipo) filtro.tipo = query.tipo;

  return Vehiculo.find(filtro).sort({ createdAt: -1 });
};

export const obtenerVehiculo = async (id) => {
  const v = await Vehiculo.findById(validarId(id));
  if (!v) throw new HttpError(404, 'Vehículo no encontrado');
  return v;
};

export const actualizarVehiculo = async (id, body) => {
  validarId(id);
  const datos = {};
  if (body.placa) datos.placa = String(body.placa).trim().toUpperCase();
  if (body.tipo) datos.tipo = body.tipo;
  if (body.marca !== undefined) datos.marca = String(body.marca).trim();
  if (body.modelo !== undefined) datos.modelo = String(body.modelo).trim();
  if (body.color !== undefined) datos.color = String(body.color).trim();

  const v = await Vehiculo.findByIdAndUpdate(id, datos, { new: true, runValidators: true });
  if (!v) throw new HttpError(404, 'Vehículo no encontrado');
  return v;
};

export const eliminarVehiculo = async (id) => {
  const v = await Vehiculo.findByIdAndDelete(validarId(id));
  if (!v) throw new HttpError(404, 'Vehículo no encontrado');
  return v;
};
