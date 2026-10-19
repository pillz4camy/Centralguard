import rateLimit from 'express-rate-limit';

const limite = (windowMs, max, message, extra = {}) =>
  rateLimit({
    windowMs, max, standardHeaders: true, legacyHeaders: false,
    handler: (req, res) => res.status(429).json({ error: 'Demasiadas solicitudes', message }),
    ...extra,
  });

export const loginLimiter = limite(15 * 60 * 1000, 10, 'Demasiados intentos de inicio de sesión. Intenta de nuevo en 15 minutos.', { skipSuccessfulRequests: true });
// Solo cuentan los registros exitosos (un error de validación o un typo no bloquea a la persona)
export const registerLimiter = limite(60 * 60 * 1000, 5, 'Demasiados registros desde esta IP. Intenta de nuevo más tarde.', { skipFailedRequests: true });
export const generalLimiter = limite(60 * 1000, 120, 'Demasiadas solicitudes. Espera un momento.');
