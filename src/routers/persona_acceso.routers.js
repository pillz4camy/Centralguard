import { Router } from 'express';
import * as ctrl from '../controllers/persona_acceso.controllers.js';
import { requireAuth, requireRol } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

router.get('/', ctrl.listar);
router.get('/:id', ctrl.obtener);
router.post('/', ctrl.crear);
router.put('/:id', ctrl.actualizar);
router.patch('/:id', ctrl.actualizar);
router.delete('/:id', requireRol('administrador'), ctrl.eliminar);

export default router;
