import { Router } from 'express';
import {
  registrarVisitante, getVisitantes, getVisitante, actualizarVisitante, salidaVisitante, eliminarVisitante,
} from '../controllers/visitante.controllers.js';
import { requireAuth, requireRol } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

router.post('/', registrarVisitante);
router.get('/', getVisitantes);                 // vigilante: solo los suyos
router.get('/:id', getVisitante);
router.patch('/:id/salida', salidaVisitante);
router.patch('/:id', actualizarVisitante);
router.delete('/:id', requireRol('administrador', 'supervisor'), eliminarVisitante);

export default router;
