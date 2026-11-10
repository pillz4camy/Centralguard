import { Router } from 'express';
import { getTurnos, getTurno, registrarTurno, updateTurno, patchFinalizarTurno, deleteTurno } from '../controllers/turno.controllers.js';
import { requireAuth, requireRol } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

router.get('/', getTurnos);
router.get('/:id', getTurno);
router.post('/', requireRol('administrador'), registrarTurno);
router.put('/:id', requireRol('administrador'), updateTurno);
router.patch('/:id', requireRol('administrador'), updateTurno);
router.patch('/:id/finalizar', patchFinalizarTurno);
router.delete('/:id', requireRol('administrador'), deleteTurno);

export default router;
