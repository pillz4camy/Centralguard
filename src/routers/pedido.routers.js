import { Router } from 'express';
import {
  createPedido,
  getPedidos,
  getPedidoById,
  updatePedido,
  patchPedido,
  deletePedido
} from '../controllers/pedido.controllers.js';

const router = Router();

router.post('/', createPedido);
router.get('/', getPedidos);
router.get('/:id', getPedidoById);
router.put('/:id', updatePedido);       
router.patch('/:id', patchPedido);    
router.delete('/:id', deletePedido);

export default router;