import EquipmentModel from '../model/equipment.model.js';

const dbCreateEquipment = async (data) => new EquipmentModel(data).save();
const dbGetEquipments = async (filter = {}) => await EquipmentModel.find(filter);
const dbGetEquipmentById = async (id) => await EquipmentModel.findById(id);
const dbUpdateEquipment = async (id, data) => await EquipmentModel.findByIdAndUpdate(id, data, { new: true, runValidators: true });
const dbDeleteEquipment = async (id) => await EquipmentModel.findByIdAndDelete(id);

export {
    dbCreateEquipment,
    dbGetEquipments,
    dbGetEquipmentById,
    dbUpdateEquipment,
    dbDeleteEquipment
};