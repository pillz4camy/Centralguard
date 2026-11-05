import { Router } from 'express';
import {
  createPedido,
  getPedidos,
  getPedidoById,
  updatePedido,
  patchPedido,
  deletePedido
} from '../controllers/pedido.controllers.js';
import { requireAuth, requireRol } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

router.post('/', createPedido);
router.get('/', getPedidos);
router.get('/:id', getPedidoById);
router.put('/:id', updatePedido);       
router.patch('/:id', patchPedido);    
router.delete('/:id', requireRol('administrador', 'supervisor'), deletePedido);

export default router;