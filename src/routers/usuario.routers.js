import { Router } from 'express';
import {
  getUsuarios, getConteoPendientes, getUsuario, actualizarUsuario, cambiarEstadoUsuario, eliminarUsuario,
} from '../controllers/usuario.controllers.js';
import { requireAuth, requireRol } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

router.get('/', requireRol('administrador', 'supervisor'), getUsuarios);
router.get('/conteo-pendientes', requireRol('administrador'), getConteoPendientes); // debe ir antes de /:id
router.get('/:id', requireRol('administrador', 'supervisor'), getUsuario);
router.patch('/:id/estado', requireRol('administrador'), cambiarEstadoUsuario);      // aprobar / rechazar (+ rol)
router.patch('/:id', requireRol('administrador'), actualizarUsuario);
router.delete('/:id', requireRol('administrador'), eliminarUsuario);

export default router;
