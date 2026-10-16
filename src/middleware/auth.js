import jwt from 'jsonwebtoken';
import { HttpError } from './errors.js';

const rolesGestion = () =>
  (process.env.ROLES_GESTION || 'admin,administrador,supervisor').split(',').map((r) => r.trim().toLowerCase());

export function requireAuth(req, res, next) {
  const [type, token] = (req.headers.authorization || '').split(' ');
  if (type !== 'Bearer' || !token) return next(new HttpError(401, 'Falta el token (Authorization: Bearer <token>)'));
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET); // { idusuario, rol }
    next();
  } catch {
    next(new HttpError(401, 'Token inválido o vencido'));
  }
}

export function requireGestion(req, res, next) {
  const rol = String(req.user?.rol || '').toLowerCase();
  if (!rolesGestion().includes(rol)) return next(new HttpError(403, 'Solo administradores o supervisores pueden hacer esto'));
  next();
}
