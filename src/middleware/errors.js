export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
    this.statusCode = status;
  }
}

export const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Ruta ${req.method} ${req.originalUrl} no encontrada`
  });
};

export const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || err.status || 500;
    let message = err.message || 'Error interno del servidor';

    // 1. Error de duplicado en MongoDB 
    if (err.code === 11000) {
        statusCode = 400;
        const campo = Object.keys(err.keyValue)[0];
        message = `El campo '${campo}' ya se encuentra registrado en el sistema.`;
    }

    // 2. Errores de validación de Mongoose 
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = Object.values(err.errors).map(val => val.message).join(', ');
    }

    // 3. IDs de MongoDB mal formados 
    if (err.name === 'CastError') {
        statusCode = 400;
        message = `El identificador '${err.value}' no tiene un formato válido.`;
    }

    res.status(statusCode).json({
        success: false,
        message
    });
};