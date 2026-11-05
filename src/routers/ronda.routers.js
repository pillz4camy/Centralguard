import { Router } from 'express';
import { getRondas, getRonda, registrarRonda, updateRonda, deleteRonda } from '../controllers/ronda.controllers.js';
import { requireAuth, requireRol } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

router.get('/', getRondas);
router.get('/:id', getRonda);
router.post('/', registrarRonda);
router.patch('/:id', updateRonda);
router.delete('/:id', requireRol('administrador', 'supervisor'), deleteRonda);

export default router;