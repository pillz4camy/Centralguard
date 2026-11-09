import { Router } from 'express';
import * as ctrl from '../controllers/user.controllers.js';
import { requireAuth, requireRol } from '../middleware/auth.js';

const router = Router();

router.post('/', ctrl.registrar);        
router.post('/register', ctrl.registrar);
router.post('/login', ctrl.login);     

router.get('/perfil', requireAuth, ctrl.perfil);
router.get('/', requireAuth, requireRol('administrador'), ctrl.listar);
router.put('/:id', requireAuth, requireRol('administrador'), ctrl.actualizar);
router.patch('/:id', requireAuth, requireRol('administrador'), ctrl.actualizar);
router.delete('/:id', requireAuth, requireRol('administrador'), ctrl.eliminar);

export default router;
