import { Router } from 'express';
import {
  getVehiculos, getVehiculo, registrarVehiculo, updateVehiculo, deleteVehiculo,
} from '../controllers/vehiculo.controllers.js';
import { requireAuth, requireRol } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

router.get('/', getVehiculos);
router.get('/:id', getVehiculo);
router.post('/', registrarVehiculo);
router.put('/:id', updateVehiculo);
router.patch('/:id', updateVehiculo);
router.delete('/:id', requireRol('administrador', 'supervisor'), deleteVehiculo);

export default router;
