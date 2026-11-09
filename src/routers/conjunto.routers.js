import { Router } from 'express';
import * as ctrl from '../controllers/conjunto.controllers.js';
import { requireAuth, requireRol } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

router.get('/', ctrl.getConjuntos);
router.get('/:id', ctrl.getConjunto);
router.post('/', requireRol('administrador'), ctrl.registrarConjunto);
router.put('/:id', requireRol('administrador'), ctrl.actualizarConjunto);
router.patch('/:id', requireRol('administrador'), ctrl.actualizarConjunto);
router.delete('/:id', requireRol('administrador'), ctrl.eliminarConjunto);

export default router;
