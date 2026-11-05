import { Router } from 'express'
import { asyncHandler } from '../utils/httpError.js'
import { autenticar, permitir } from '../middleware/auth.js'
import { asignarRol } from '../controllers/usuarios.controller.js'

const router = Router()

/**
 * @openapi
 * /api/usuarios/{id}/rol:
 *   put:
 *     tags: [Usuarios]
 *     summary: Asignar o cambiar el rol de un usuario (solo administrador)
 *     description: El usuario verá el cambio al volver a iniciar sesión, porque el rol viaja dentro del token. Un administrador no puede quitarse su propio rol.
 *     security: [{ bearerAuth: [] }]
 *     parameters: [{ in: path, name: id, required: true, schema: { type: string }, description: "_id del usuario" }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [idroles]
 *             properties:
 *               idroles: { type: integer, example: 2 }
 *     responses:
 *       200: { description: Rol asignado }
 *       400: { description: idroles inválido o el rol no existe }
 *       401: { description: Token ausente o inválido }
 *       403: { description: Sin permisos }
 *       404: { description: Usuario no encontrado }
 *       409: { description: El administrador intenta quitarse su propio rol }
 *       500: { description: Error interno }
 */
router.put('/:id/rol', autenticar, permitir(1), asyncHandler(asignarRol))

export default router
