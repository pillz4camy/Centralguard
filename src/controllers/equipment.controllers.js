import {
    dbCreateEquipment,
    dbGetEquipments,
    dbGetEquipmentById,
    dbUpdateEquipment,
    dbDeleteEquipment
} from '../services/equipment.services.js';
import mongoose from 'mongoose';

const getEquipments = async (req, res) => {
    try {
        const { estado } = req.query;
        const filter = estado ? { estado } : {};
        const equipments = await dbGetEquipments(filter);
        res.status(200).json({ success: true, data: equipments });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getEquipmentById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, message: 'ID no válido' });
        const equipment = await dbGetEquipmentById(id);
        if (!equipment) return res.status(404).json({ success: false, message: 'Equipo no encontrado' });
        res.status(200).json({ success: true, data: equipment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const createEquipment = async (req, res) => {
    try {
        const newEquipment = await dbCreateEquipment(req.body);
        res.status(201).json({ success: true, message: 'Equipo creado con éxito', data: newEquipment });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const updateEquipment = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, message: 'ID no válido' });
        const updated = await dbUpdateEquipment(id, req.body);
        if (!updated) return res.status(404).json({ success: false, message: 'Equipo no encontrado' });
        res.status(200).json({ success: true, message: 'Equipo actualizado correctamente', data: updated });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const deleteEquipment = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, message: 'ID no válido' });
        const deleted = await dbDeleteEquipment(id);
        if (!deleted) return res.status(404).json({ success: false, message: 'Equipo no encontrado' });
        res.status(200).json({ success: true, message: 'Equipo eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export { getEquipments, getEquipmentById, createEquipment, updateEquipment, deleteEquipment };