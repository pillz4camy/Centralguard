import { 
    dbCreateEquipment, 
    dbGetEquipments, 
    dbGetEquipmentById, 
    dbUpdateEquipment, 
    dbDeleteEquipment 
} from '../services/equipment.services.js';

export const createEquipment = async (req, res, next) => {
    try {
        const newEquipment = await dbCreateEquipment(req.body);
        res.status(201).json({ success: true, data: newEquipment });
    } catch (error) {
        next(error);
    }
};

export const getEquipments = async (req, res, next) => {
    try {
        const equipments = await dbGetEquipments();
        res.status(200).json({ success: true, data: equipments });
    } catch (error) {
        next(error);
    }
};

export const getEquipmentById = async (req, res, next) => {
    try {
        const equipment = await dbGetEquipmentById(req.params.id);
        if (!equipment) {
            return res.status(404).json({ success: false, message: 'Equipo no encontrado' });
        }
        res.status(200).json({ success: true, data: equipment });
    } catch (error) {
        next(error);
    }
};

export const updateEquipment = async (req, res, next) => {
    try {
        const updatedEquipment = await dbUpdateEquipment(req.params.id, req.body);
        if (!updatedEquipment) {
            return res.status(404).json({ success: false, message: 'Equipo no encontrado' });
        }
        res.status(200).json({ success: true, data: updatedEquipment });
    } catch (error) {
        next(error);
    }
};

export const deleteEquipment = async (req, res, next) => {
    try {
        const deletedEquipment = await dbDeleteEquipment(req.params.id);
        if (!deletedEquipment) {
            return res.status(404).json({ success: false, message: 'Equipo no encontrado' });
        }
        res.status(200).json({ success: true, message: 'Equipo eliminado correctamente' });
    } catch (error) {
        next(error);
    }
}; 