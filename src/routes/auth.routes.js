import { Router } from 'express'
import { asyncHandler } from '../utils/httpError.js'
import { login, registrar } from '../controllers/auth.controller.js'

const router = Router()

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Registrar un vigilante
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [usuario, contrasena, nombre]
 *             properties:
 *               usuario: { type: string, example: carlos@correo.com }
 *               contrasena: { type: string, example: "123456" }
 *               nombre: { type: string, example: Carlos }
 *               apellido: { type: string, example: Gómez }
 *     responses:
 *       201: { description: Usuario creado }
 *       400: { description: Datos inválidos }
 *       409: { description: El usuario ya existe }
 *       500: { description: Error interno }
 */
router.post('/register', asyncHandler(registrar))

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Iniciar sesión y obtener el token JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [usuario, contrasena]
 *             properties:
 *               usuario: { type: string, example: carlos@correo.com }
 *               contrasena: { type: string, example: "123456" }
 *     responses:
 *       200: { description: Login correcto, devuelve token y datos del usuario }
 *       400: { description: Faltan campos }
 *       401: { description: Credenciales incorrectas }
 *       500: { description: Error interno }
 */
router.post('/login', asyncHandler(login))

export default router
