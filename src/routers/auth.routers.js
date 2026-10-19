import { Router } from 'express';
import { registro, iniciarSesion, cambiarClave } from '../controllers/auth.controllers.js';
import { requireAuth } from '../middleware/auth.js';
import { loginLimiter, registerLimiter } from '../middleware/rateLimit.js';

const router = Router();
router.post('/registro', registerLimiter, registro);
router.post('/login', loginLimiter, iniciarSesion);
router.post('/cambiar-contrasena', requireAuth, cambiarClave);
export default router;
