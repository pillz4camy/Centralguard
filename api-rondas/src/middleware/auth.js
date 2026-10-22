import jwt from 'jsonwebtoken'
import { HttpError } from '../utils/httpError.js'

export function autenticar(req, res, next) {
  const header = req.headers.authorization || ''
  const [tipo, token] = header.split(' ')
  if (tipo !== 'Bearer' || !token) return next(new HttpError(401, 'Token requerido (Authorization: Bearer <token>)'))

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    req.user = { id: payload.id, idroles: payload.idroles, nombre: payload.nombre }
    next()
  } catch (err) {
    next(err) // JsonWebTokenError / TokenExpiredError -> 401 en errorHandler
  }
}

export const permitir = (...roles) => (req, res, next) =>
  roles.includes(req.user.idroles) ? next() : next(new HttpError(403, 'No tienes permisos para esta acción'))
