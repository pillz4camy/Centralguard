const jwt = require('jsonwebtoken');
const { HttpError } = require('./errors');

const ADMIN_ROLE = () => process.env.ADMIN_ROLE_NAME || 'Administrador';
const esAdmin = (user) => user?.rol === ADMIN_ROLE();

function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const [type, token] = header.split(' ');
  if (type !== 'Bearer' || !token) return next(new HttpError(401, 'Falta el token (Authorization: Bearer <token>)'));
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET); // { idusuario, rol }
    next();
  } catch {
    next(new HttpError(401, 'Token inválido o vencido'));
  }
}

function requireAdmin(req, res, next) {
  if (!esAdmin(req.user)) return next(new HttpError(403, 'Solo un administrador puede hacer esto'));
  next();
}

module.exports = { requireAuth, requireAdmin, esAdmin };
