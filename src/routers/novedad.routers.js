import { Router } from 'express';
import {
  createNovedad,
  getNovedades,
  getNovedadById,
  updateNovedad,
  patchNovedad,
  deleteNovedad
} from '../controllers/novedad.controllers.js';
import { requireAuth, requireRol } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

router.post('/', createNovedad);
router.get('/', getNovedades);
router.get('/:id', getNovedadById);
router.put('/:id', updateNovedad);      
router.patch('/:id', patchNovedad);   
router.delete('/:id', requireRol('administrador'), deleteNovedad);

export default router;