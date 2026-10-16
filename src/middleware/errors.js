export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export const notFound = (req, res) =>
  res.status(404).json({ error: 'No encontrado', message: `Ruta ${req.method} ${req.originalUrl} no existe` });

// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  let status = err.status || 500;
  let message = err.message;

  if (err.type === 'entity.parse.failed') { status = 400; message = 'JSON inválido'; }
  else if (err.name === 'ValidationError') { status = 400; message = Object.values(err.errors).map((e) => e.message).join('; '); }
  else if (err.name === 'CastError') { status = 400; message = `Valor inválido para ${err.path}`; }
  else if (err.code === 11000) { status = 400; message = `Ya existe un puesto con ese ${Object.keys(err.keyValue || {}).join(', ')}`; }

  if (status === 500) console.error(err);
  res.status(status).json({
    error: { 400: 'Solicitud inválida', 401: 'No autorizado', 403: 'Prohibido', 404: 'No encontrado' }[status] || 'Error interno del servidor',
    message: status === 500 ? 'Ocurrió un error inesperado' : message,
  });
};
