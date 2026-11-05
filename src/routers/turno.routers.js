import { Router } from 'express';
import { getTurnos, getTurno, registrarTurno, updateTurno, deleteTurno } from '../controllers/turno.controllers.js';
import { requireAuth, requireRol } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

router.get('/', getTurnos);
router.get('/:id', getTurno);
router.post('/', requireRol('administrador', 'supervisor'), registrarTurno);
router.patch('/:id', requireRol('administrador', 'supervisor'), updateTurno);
router.delete('/:id', requireRol('administrador', 'supervisor'), deleteTurno);

export default router;