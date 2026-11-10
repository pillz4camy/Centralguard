import { Router } from 'express';
import {
  getPuestos, getPuesto, registrarPuesto, actualizarPuesto, actualizarParcialPuesto, eliminarPuesto,
} from '../controllers/puesto.controllers.js';
import { requireAuth, requireRol } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

router.get('/', getPuestos);
router.get('/:id', getPuesto);
router.post('/', requireRol('administrador'), registrarPuesto);
router.put('/:id', requireRol('administrador'), actualizarPuesto);
router.patch('/:id', requireRol('administrador'), actualizarParcialPuesto);
router.delete('/:id', requireRol('administrador'), eliminarPuesto);

export default router;