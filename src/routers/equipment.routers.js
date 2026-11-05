import { Router } from 'express';
import * as ctrl from '../controllers/equipment.controllers.js';
import { requireAuth, requireRol } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

router.get('/', ctrl.getEquipment);
router.get('/:id', ctrl.getEquipmentById);
router.post('/', ctrl.createEquipment);
router.put('/:id', ctrl.updateEquipment);
router.delete('/:id', requireRol('administrador', 'supervisor'), ctrl.deleteEquipment);

export default router;