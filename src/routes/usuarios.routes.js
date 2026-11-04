import { Router } from 'express'
import { asyncHandler } from '../utils/httpError.js'
import { autenticar, permitir } from '../middleware/auth.js'
import { listar } from '../controllers/usuarios.controller.js'

const router = Router()

/**
 * @openapi
 * /api/usuarios:
 *   get:
 *     tags: [Usuarios]
 *     summary: Listar usuarios (solo supervisor o admin). Úsalo con idroles=3 para obtener los vigilantes.
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: query, name: idroles, schema: { type: integer, enum: [1, 2, 3] }, description: "1 admin, 2 supervisor, 3 vigilante" }
 *     responses:
 *       200: { description: Lista de usuarios (sin contraseña) }
 *       401: { description: Token ausente o inválido }
 *       403: { description: Sin permisos }
 *       500: { description: Error interno }
 */
router.get('/', autenticar, permitir(1, 2), asyncHandler(listar))

export default router
