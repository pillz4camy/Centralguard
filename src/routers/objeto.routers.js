import { Router } from 'express';
import * as ctrl from '../controllers/objeto.controllers.js';
import { requireAuth, requireRol } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

router.get('/', ctrl.getObjetos);
router.get('/:id', ctrl.getObjeto);
router.post('/', ctrl.crearObjeto);
router.put('/:id', ctrl.actualizarObjeto);
router.patch('/:id', ctrl.actualizarObjeto);
router.delete('/:id', requireRol('administrador', 'supervisor'), ctrl.eliminarObjeto);

export default router;
