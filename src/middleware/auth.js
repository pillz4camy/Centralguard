import jwt from 'jsonwebtoken';
import { HttpError } from './errors.js';

export const ROLES = ['administrador', 'supervisor', 'vigilante'];

// Normaliza el rol por si viene como "admin" u otros formatos
export const normalizarRol = (r) => {
  const x = String(r || '').trim().toLowerCase();
  return x === 'admin' ? 'administrador' : x;
};

// Tu función verifyToken adaptada
export const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ 
            success: false, 
            message: 'Acceso denegado. No se proporcionó un token de autenticación.' 
        });
    }

    try {
        const secretKey = process.env.JWT_SECRET || 'clave_secreta_centralguard_2026';
        const verified = jwt.verify(token, secretKey);
        
        // Aseguramos estandarizar idusuario y rol normalizado
        req.user = {
            ...verified,
            idusuario: String(verified.idusuario || verified.id || ''),
            rol: normalizarRol(verified.rol)
        };
        
        next();
    } catch (error) {
        return res.status(403).json({ 
            success: false, 
            message: 'Token inválido o expirado.' 
        });
    }
};

// Alias para mantener compatibilidad con las rutas que usan requireAuth
export const requireAuth = verifyToken;

// Middleware de roles
export const requireRol = (...permitidos) => (req, res, next) =>
  permitidos.includes(req.user?.rol)
    ? next()
    : next(new HttpError(403, `Solo ${permitidos.join(' o ')} pueden hacer esto`));

// Validación de roles de gestión (usada en servicios de objetos perdidos)
export const esGestion = (user) => ['administrador', 'supervisor'].includes(user?.rol);