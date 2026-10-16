import { Router } from 'express';
import {
  getPuestos, getPuesto, registrarPuesto, actualizarPuesto, actualizarParcialPuesto, eliminarPuesto,
} from '../controllers/puesto.controllers.js';
import { requireAuth, requireGestion } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

router.get('/', getPuestos);
router.get('/:id', getPuesto);
router.post('/', requireGestion, registrarPuesto);
router.put('/:id', requireGestion, actualizarPuesto);
router.patch('/:id', requireGestion, actualizarParcialPuesto);
router.delete('/:id', requireGestion, eliminarPuesto);

export default router;
