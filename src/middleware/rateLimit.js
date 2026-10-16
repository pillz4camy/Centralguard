const rateLimit = require('express-rate-limit');

const limite = (windowMs, max, message, extra = {}) =>
  rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => res.status(429).json({ error: 'Demasiadas solicitudes', message }),
    ...extra,
  });

// Login: 10 intentos fallidos cada 15 minutos por IP (los exitosos no cuentan)
const loginLimiter = limite(15 * 60 * 1000, 10, 'Demasiados intentos de inicio de sesión. Intenta de nuevo en 15 minutos.', { skipSuccessfulRequests: true });

// Registro: 5 cuentas por hora por IP
const registerLimiter = limite(60 * 60 * 1000, 5, 'Demasiados registros desde esta IP. Intenta de nuevo más tarde.');

module.exports = { loginLimiter, registerLimiter };
