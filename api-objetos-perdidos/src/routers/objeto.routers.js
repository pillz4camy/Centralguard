import { Router } from 'express';
import {
  registrarObjeto, getObjetos, getResumen, getObjeto, actualizarObjeto, entregarObjeto, eliminarObjeto,
} from '../controllers/objeto.controllers.js';
import { requireAuth, requireRol } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

router.post('/', registrarObjeto);
router.get('/', getObjetos);                    // vigilante: solo los suyos
router.get('/resumen', getResumen);             // debe ir antes de /:id
router.get('/:id', getObjeto);
router.patch('/:id/entregar', entregarObjeto);
router.patch('/:id', actualizarObjeto);
router.delete('/:id', requireRol('administrador', 'supervisor'), eliminarObjeto);

export default router;
