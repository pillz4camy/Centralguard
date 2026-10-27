import Novedad from '../model/novedad.model.js';

export const createNovedadService = async (data) => {
  return await Novedad.create(data);
};

export const getNovedadesService = async () => {
  return await Novedad.find();
};

export const getNovedadByIdService = async (id) => {
  return await Novedad.findById(id);
};

export const updateNovedadService = async (id, data) => {
  return await Novedad.findByIdAndUpdate(id, data, { new: true });
};

export const deleteNovedadService = async (id) => {
  return await Novedad.findByIdAndDelete(id);
};