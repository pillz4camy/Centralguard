import { Router } from 'express';
import {
    getEquipments,
    getEquipmentById,
    createEquipment,
    updateEquipment,
    deleteEquipment
} from '../controllers/equipment.controllers.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', verifyToken, getEquipments);
router.get('/:id', verifyToken, getEquipmentById);
router.post('/', verifyToken, createEquipment);
router.put('/:id', verifyToken, updateEquipment);
router.delete('/:id', verifyToken, deleteEquipment);

export default router;