import { Router } from 'express';
import * as ctrl from '../controllers/registro_acceso.controllers.js';
import { requireAuth, requireRol } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

router.get('/', ctrl.getRegistros);
router.get('/:id', ctrl.getRegistro);
router.post('/', ctrl.crearRegistro);
router.patch('/:id/salida', ctrl.registrarSalida);
router.put('/:id', ctrl.actualizarRegistro);
router.delete('/:id', requireRol('administrador', 'supervisor'), ctrl.eliminarRegistro);

export default router;
