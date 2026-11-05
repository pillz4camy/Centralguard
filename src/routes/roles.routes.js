import { Router } from 'express'
import { asyncHandler } from '../utils/httpError.js'
import { autenticar, permitir } from '../middleware/auth.js'
import { actualizar, crear, eliminar, listar, obtener, usuariosDelRol } from '../controllers/roles.controller.js'

const router = Router()
router.use(autenticar)

/**
 * @openapi
 * /api/roles:
 *   get:
 *     tags: [Roles]
 *     summary: Listar los roles
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: query, name: buscar, schema: { type: string }, description: Búsqueda parcial por nombre }
 *     responses:
 *       200: { description: Lista de roles ordenada por idroles }
 *       401: { description: Token ausente o inválido }
 *       500: { description: Error interno }
 *   post:
 *     tags: [Roles]
 *     summary: Crear un rol (solo administrador)
 *     description: Si no se envía idroles se asigna el siguiente número disponible.
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/RolInput' }
 *     responses:
 *       201: { description: Rol creado }
 *       400: { description: Datos inválidos }
 *       401: { description: Token ausente o inválido }
 *       403: { description: Sin permisos }
 *       409: { description: Ya existe un rol con ese id o nombre }
 *       500: { description: Error interno }
 */
router.route('/')
  .get(asyncHandler(listar))
  .post(permitir(1), asyncHandler(crear))

/**
 * @openapi
 * /api/roles/{idroles}/usuarios:
 *   get:
 *     tags: [Roles]
 *     summary: Listar los usuarios que tienen un rol (supervisor o administrador)
 *     security: [{ bearerAuth: [] }]
 *     parameters: [{ in: path, name: idroles, required: true, schema: { type: integer, example: 3 } }]
 *     responses:
 *       200: { description: El rol y sus usuarios }
 *       400: { description: idroles inválido }
 *       401: { description: Token ausente o inválido }
 *       403: { description: Sin permisos }
 *       404: { description: Rol no encontrado }
 *       500: { description: Error interno }
 */
router.get('/:idroles/usuarios', permitir(1, 2), asyncHandler(usuariosDelRol))

/**
 * @openapi
 * /api/roles/{idroles}:
 *   get:
 *     tags: [Roles]
 *     summary: Obtener un rol por su idroles
 *     security: [{ bearerAuth: [] }]
 *     parameters: [{ in: path, name: idroles, required: true, schema: { type: integer, example: 3 } }]
 *     responses:
 *       200: { description: Rol encontrado }
 *       400: { description: idroles inválido }
 *       401: { description: Token ausente o inválido }
 *       404: { description: Rol no encontrado }
 *       500: { description: Error interno }
 *   put:
 *     tags: [Roles]
 *     summary: Cambiar el nombre o la descripción de un rol (solo administrador)
 *     description: El idroles no se puede modificar.
 *     security: [{ bearerAuth: [] }]
 *     parameters: [{ in: path, name: idroles, required: true, schema: { type: integer, example: 3 } }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre_rol: { type: string, example: Guarda de seguridad }
 *               descripcion: { type: string }
 *     responses:
 *       200: { description: Rol actualizado }
 *       400: { description: Datos inválidos }
 *       401: { description: Token ausente o inválido }
 *       403: { description: Sin permisos }
 *       404: { description: Rol no encontrado }
 *       409: { description: Ya existe un rol con ese nombre }
 *       500: { description: Error interno }
 *   delete:
 *     tags: [Roles]
 *     summary: Eliminar un rol (solo administrador)
 *     description: No se pueden eliminar los roles base (1, 2 y 3) ni roles que tengan usuarios asignados.
 *     security: [{ bearerAuth: [] }]
 *     parameters: [{ in: path, name: idroles, required: true, schema: { type: integer, example: 4 } }]
 *     responses:
 *       200: { description: Rol eliminado }
 *       400: { description: idroles inválido }
 *       401: { description: Token ausente o inválido }
 *       403: { description: Sin permisos }
 *       404: { description: Rol no encontrado }
 *       409: { description: Rol base o con usuarios asignados }
 *       500: { description: Error interno }
 */
router.route('/:idroles')
  .get(asyncHandler(obtener))
  .put(permitir(1), asyncHandler(actualizar))
  .delete(permitir(1), asyncHandler(eliminar))

export default router
