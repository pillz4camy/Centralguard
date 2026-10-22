import { Router } from 'express'
import { asyncHandler } from '../utils/httpError.js'
import { autenticar, permitir } from '../middleware/auth.js'
import { actualizar, crear, eliminar, listar, obtener } from '../controllers/rondas.controller.js'

const router = Router()
router.use(autenticar)

/**
 * @openapi
 * /api/rondas:
 *   get:
 *     tags: [Rondas]
 *     summary: Listar rondas (el vigilante solo ve las suyas)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: query, name: sector, schema: { type: string }, description: Búsqueda parcial por sector }
 *       - { in: query, name: desde, schema: { type: string, format: date }, description: "Fecha inicial (YYYY-MM-DD)" }
 *       - { in: query, name: hasta, schema: { type: string, format: date }, description: "Fecha final (YYYY-MM-DD)" }
 *       - { in: query, name: idusuario, schema: { type: string }, description: Solo supervisor/admin }
 *       - { in: query, name: page, schema: { type: integer, default: 1 } }
 *       - { in: query, name: limit, schema: { type: integer, default: 20 } }
 *     responses:
 *       200: { description: Lista paginada de rondas }
 *       400: { description: Parámetro inválido }
 *       401: { description: Token ausente o inválido }
 *       500: { description: Error interno }
 *   post:
 *     tags: [Rondas]
 *     summary: Registrar una ronda (se asocia al usuario del token)
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/RondaInput' }
 *     responses:
 *       201: { description: Ronda creada }
 *       400: { description: Datos inválidos }
 *       401: { description: Token ausente o inválido }
 *       500: { description: Error interno }
 */
router.route('/')
  .get(asyncHandler(listar))
  .post(asyncHandler(crear))

/**
 * @openapi
 * /api/rondas/{id}:
 *   get:
 *     tags: [Rondas]
 *     summary: Obtener una ronda por id
 *     security: [{ bearerAuth: [] }]
 *     parameters: [{ in: path, name: id, required: true, schema: { type: string } }]
 *     responses:
 *       200: { description: Ronda encontrada }
 *       400: { description: Id inválido }
 *       401: { description: Token ausente o inválido }
 *       403: { description: La ronda es de otro vigilante }
 *       404: { description: Ronda no encontrada }
 *       500: { description: Error interno }
 *   put:
 *     tags: [Rondas]
 *     summary: Modificar sector u observaciones de una ronda
 *     security: [{ bearerAuth: [] }]
 *     parameters: [{ in: path, name: id, required: true, schema: { type: string } }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/RondaInput' }
 *     responses:
 *       200: { description: Ronda actualizada }
 *       400: { description: Datos inválidos }
 *       401: { description: Token ausente o inválido }
 *       403: { description: La ronda es de otro vigilante }
 *       404: { description: Ronda no encontrada }
 *       500: { description: Error interno }
 *   delete:
 *     tags: [Rondas]
 *     summary: Eliminar una ronda (solo supervisor o administrador)
 *     security: [{ bearerAuth: [] }]
 *     parameters: [{ in: path, name: id, required: true, schema: { type: string } }]
 *     responses:
 *       200: { description: Ronda eliminada }
 *       401: { description: Token ausente o inválido }
 *       403: { description: Sin permisos }
 *       404: { description: Ronda no encontrada }
 *       500: { description: Error interno }
 */
router.route('/:id')
  .get(asyncHandler(obtener))
  .put(asyncHandler(actualizar))
  .delete(permitir(1, 2), asyncHandler(eliminar))

export default router
