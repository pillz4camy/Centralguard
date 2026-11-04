import { Router } from 'express'
import { asyncHandler } from '../utils/httpError.js'
import { autenticar, permitir } from '../middleware/auth.js'
import { actualizar, crear, eliminar, listar, obtener, registrarSalida } from '../controllers/vehiculos.controller.js'

const router = Router()
router.use(autenticar)

/**
 * @openapi
 * /api/vehiculos:
 *   get:
 *     tags: [Vehículos]
 *     summary: Listar registros de vehículos, del más reciente al más antiguo
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: query, name: placa, schema: { type: string }, description: "Búsqueda parcial por placa (ej: ABC)" }
 *       - { in: query, name: estado, schema: { type: string, enum: [dentro, salio] } }
 *       - { in: query, name: tipo_registro, schema: { type: string, enum: [residente, visitante] } }
 *       - { in: query, name: tipo_vehiculo, schema: { type: string, enum: [carro, moto, camioneta, otro] } }
 *       - { in: query, name: desde, schema: { type: string, example: "2026-11-01" }, description: "Ingreso desde (YYYY-MM-DD)" }
 *       - { in: query, name: hasta, schema: { type: string, example: "2026-11-30" }, description: "Ingreso hasta (YYYY-MM-DD)" }
 *       - { in: query, name: page, schema: { type: integer, default: 1 } }
 *       - { in: query, name: limit, schema: { type: integer, default: 20 } }
 *     responses:
 *       200: { description: Lista paginada }
 *       400: { description: Parámetro inválido }
 *       401: { description: Token ausente o inválido }
 *       500: { description: Error interno }
 *   post:
 *     tags: [Vehículos]
 *     summary: Registrar el ingreso de un vehículo
 *     description: La placa se normaliza (ABC-123 pasa a ABC123). No se puede registrar un vehículo que ya está dentro.
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/VehiculoInput' }
 *     responses:
 *       201: { description: Ingreso registrado }
 *       400: { description: Datos inválidos }
 *       401: { description: Token ausente o inválido }
 *       409: { description: El vehículo ya está dentro }
 *       500: { description: Error interno }
 */
router.route('/')
  .get(asyncHandler(listar))
  .post(asyncHandler(crear))

/**
 * @openapi
 * /api/vehiculos/{id}/salida:
 *   patch:
 *     tags: [Vehículos]
 *     summary: Registrar la salida de un vehículo (cualquier vigilante)
 *     security: [{ bearerAuth: [] }]
 *     parameters: [{ in: path, name: id, required: true, schema: { type: string } }]
 *     responses:
 *       200: { description: Salida registrada }
 *       400: { description: Id inválido }
 *       401: { description: Token ausente o inválido }
 *       404: { description: Registro no encontrado }
 *       409: { description: La salida ya estaba registrada }
 *       500: { description: Error interno }
 */
router.patch('/:id/salida', asyncHandler(registrarSalida))

/**
 * @openapi
 * /api/vehiculos/{id}:
 *   get:
 *     tags: [Vehículos]
 *     summary: Obtener un registro por id
 *     security: [{ bearerAuth: [] }]
 *     parameters: [{ in: path, name: id, required: true, schema: { type: string } }]
 *     responses:
 *       200: { description: Registro encontrado }
 *       400: { description: Id inválido }
 *       401: { description: Token ausente o inválido }
 *       404: { description: Registro no encontrado }
 *       500: { description: Error interno }
 *   put:
 *     tags: [Vehículos]
 *     summary: Corregir datos de un registro (el vigilante solo los que él hizo). Se envían solo los campos que cambian.
 *     security: [{ bearerAuth: [] }]
 *     parameters: [{ in: path, name: id, required: true, schema: { type: string } }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/VehiculoInput' }
 *     responses:
 *       200: { description: Registro actualizado }
 *       400: { description: Datos inválidos }
 *       401: { description: Token ausente o inválido }
 *       403: { description: El registro es de otro vigilante }
 *       404: { description: Registro no encontrado }
 *       409: { description: La placa ya está registrada dentro }
 *       500: { description: Error interno }
 *   delete:
 *     tags: [Vehículos]
 *     summary: Eliminar un registro (solo supervisor o administrador)
 *     security: [{ bearerAuth: [] }]
 *     parameters: [{ in: path, name: id, required: true, schema: { type: string } }]
 *     responses:
 *       200: { description: Registro eliminado }
 *       401: { description: Token ausente o inválido }
 *       403: { description: Sin permisos }
 *       404: { description: Registro no encontrado }
 *       500: { description: Error interno }
 */
router.route('/:id')
  .get(asyncHandler(obtener))
  .put(asyncHandler(actualizar))
  .delete(permitir(1, 2), asyncHandler(eliminar))

export default router
