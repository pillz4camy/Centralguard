import { Router } from 'express'
import { asyncHandler } from '../utils/httpError.js'
import { autenticar, permitir } from '../middleware/auth.js'
import { actualizar, crear, eliminar, listar, obtener } from '../controllers/turnos.controller.js'

const router = Router()
router.use(autenticar)

/**
 * @openapi
 * /api/turnos:
 *   get:
 *     tags: [Turnos]
 *     summary: Listar turnos ordenados por fecha y hora (el vigilante solo ve los suyos)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: query, name: desde, schema: { type: string, example: "2026-11-01" }, description: "Fecha inicial (YYYY-MM-DD)" }
 *       - { in: query, name: hasta, schema: { type: string, example: "2026-11-30" }, description: "Fecha final (YYYY-MM-DD)" }
 *       - { in: query, name: puesto, schema: { type: string }, description: Búsqueda parcial por puesto }
 *       - { in: query, name: idusuario, schema: { type: string }, description: Solo supervisor/admin }
 *       - { in: query, name: page, schema: { type: integer, default: 1 } }
 *       - { in: query, name: limit, schema: { type: integer, default: 20 } }
 *     responses:
 *       200: { description: Lista paginada de turnos }
 *       400: { description: Parámetro inválido }
 *       401: { description: Token ausente o inválido }
 *       500: { description: Error interno }
 *   post:
 *     tags: [Turnos]
 *     summary: Programar un turno (solo supervisor o admin)
 *     description: Si hora_fin es menor que hora_inicio se entiende que el turno cruza la medianoche. Un vigilante no puede tener dos turnos que se crucen el mismo día.
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/TurnoInput' }
 *     responses:
 *       201: { description: Turno creado }
 *       400: { description: Datos inválidos o idusuario que no es vigilante }
 *       401: { description: Token ausente o inválido }
 *       403: { description: Sin permisos }
 *       409: { description: El vigilante ya tiene un turno que se cruza }
 *       500: { description: Error interno }
 */
router.route('/')
  .get(asyncHandler(listar))
  .post(permitir(1, 2), asyncHandler(crear))

/**
 * @openapi
 * /api/turnos/{id}:
 *   get:
 *     tags: [Turnos]
 *     summary: Obtener un turno por id
 *     security: [{ bearerAuth: [] }]
 *     parameters: [{ in: path, name: id, required: true, schema: { type: string } }]
 *     responses:
 *       200: { description: Turno encontrado }
 *       400: { description: Id inválido }
 *       401: { description: Token ausente o inválido }
 *       403: { description: El turno es de otro vigilante }
 *       404: { description: Turno no encontrado }
 *       500: { description: Error interno }
 *   put:
 *     tags: [Turnos]
 *     summary: Modificar un turno (solo supervisor o admin). Se envían solo los campos que cambian.
 *     security: [{ bearerAuth: [] }]
 *     parameters: [{ in: path, name: id, required: true, schema: { type: string } }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idusuario: { type: string }
 *               fecha: { type: string, example: "2026-11-06" }
 *               hora_inicio: { type: string, example: "07:00" }
 *               hora_fin: { type: string, example: "15:00" }
 *               puesto: { type: string }
 *               observaciones: { type: string }
 *     responses:
 *       200: { description: Turno actualizado }
 *       400: { description: Datos inválidos }
 *       401: { description: Token ausente o inválido }
 *       403: { description: Sin permisos }
 *       404: { description: Turno no encontrado }
 *       409: { description: El vigilante ya tiene un turno que se cruza }
 *       500: { description: Error interno }
 *   delete:
 *     tags: [Turnos]
 *     summary: Eliminar un turno (solo supervisor o admin)
 *     security: [{ bearerAuth: [] }]
 *     parameters: [{ in: path, name: id, required: true, schema: { type: string } }]
 *     responses:
 *       200: { description: Turno eliminado }
 *       401: { description: Token ausente o inválido }
 *       403: { description: Sin permisos }
 *       404: { description: Turno no encontrado }
 *       500: { description: Error interno }
 */
router.route('/:id')
  .get(asyncHandler(obtener))
  .put(permitir(1, 2), asyncHandler(actualizar))
  .delete(permitir(1, 2), asyncHandler(eliminar))

export default router
