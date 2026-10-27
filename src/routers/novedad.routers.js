import { Router } from 'express';
import {
  createNovedad,
  getNovedades,
  getNovedadById,
  updateNovedad,
  deleteNovedad
} from '../controllers/novedad.controllers.js';

const router = Router();

router.post('/', createNovedad);
router.get('/', getNovedades);
router.get('/:id', getNovedadById);
router.put('/:id', updateNovedad);
router.delete('/:id', deleteNovedad);

export default router;