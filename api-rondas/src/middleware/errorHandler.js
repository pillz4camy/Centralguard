export const notFound = (req, res) =>
  res.status(404).json({ error: `Ruta no encontrada: ${req.method} ${req.originalUrl}` })

// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: 'Datos inválidos', detalles: Object.values(err.errors).map(e => e.message) })
  }
  if (err.name === 'CastError') return res.status(400).json({ error: `Valor inválido para "${err.path}"` })
  if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'JSON mal formado' })
  if (err.code === 11000) return res.status(409).json({ error: 'Ya existe un registro con esos datos' })
  if (err.name === 'TokenExpiredError') return res.status(401).json({ error: 'El token expiró, inicia sesión de nuevo' })
  if (err.name === 'JsonWebTokenError') return res.status(401).json({ error: 'Token inválido' })
  if (err.status) return res.status(err.status).json({ error: err.message })

  console.error(err)
  res.status(500).json({ error: 'Error interno del servidor' })
}
