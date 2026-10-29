import jwt from 'jsonwebtoken';
import { HttpError } from './errors.js';

export const ROLES = ['administrador', 'supervisor', 'vigilante'];

// Acepta "admin" como alias de "administrador" (por si el token viene de otro sistema)
export const normalizarRol = (r) => {
  const x = String(r || '').trim().toLowerCase();
  return x === 'admin' ? 'administrador' : x;
};

export function requireAuth(req, res, next) {
  const [type, token] = (req.headers.authorization || '').split(' ');
  if (type !== 'Bearer' || !token) return next(new HttpError(401, 'Falta el token (Authorization: Bearer <token>)'));
  try {
    const p = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { idusuario: String(p.idusuario), rol: normalizarRol(p.rol) };
    next();
  } catch {
    next(new HttpError(401, 'Token inválido o vencido'));
  }
}

export const requireRol = (...permitidos) => (req, res, next) =>
  permitidos.includes(req.user?.rol)
    ? next()
    : next(new HttpError(403, `Solo ${permitidos.join(' o ')} pueden hacer esto`));

export const esGestion = (user) => ['administrador', 'supervisor'].includes(user?.rol);
