import Ronda from '../models/Ronda.js'
import { HttpError } from '../utils/httpError.js'

const esVigilante = (user) => user.idroles === 3

// Un vigilante solo toca sus rondas; supervisor y admin tocan todas
async function buscarConPermiso(id, user) {
  const ronda = await Ronda.findById(id)
  if (!ronda) throw new HttpError(404, 'Ronda no encontrada')
  if (esVigilante(user) && String(ronda.idusuario) !== String(user.id)) {
    throw new HttpError(403, 'Esta ronda pertenece a otro vigilante')
  }
  return ronda
}

export async function listar(req, res) {
  const { sector, desde, hasta, idusuario } = req.query
  const page = Math.max(parseInt(req.query.page) || 1, 1)
  const limit = Math.min(Math.max(parseInt(req.query.limit) || 20, 1), 100)

  const filtro = {}
  if (esVigilante(req.user)) filtro.idusuario = req.user.id
  else if (idusuario) filtro.idusuario = idusuario
  if (sector) filtro.sector = { $regex: sector.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' }
  if (desde || hasta) {
    filtro.fecha_hora = {}
    if (desde) filtro.fecha_hora.$gte = new Date(desde)
    if (hasta) filtro.fecha_hora.$lte = new Date(`${hasta}T23:59:59.999`)
  }

  const [datos, total] = await Promise.all([
    Ronda.find(filtro).sort({ fecha_hora: -1 }).skip((page - 1) * limit).limit(limit),
    Ronda.countDocuments(filtro)
  ])
  res.json({ total, page, paginas: Math.ceil(total / limit), datos })
}

export async function obtener(req, res) {
  res.json(await buscarConPermiso(req.params.id, req.user))
}

export async function crear(req, res) {
  const { sector, observaciones } = req.body
  const ronda = await Ronda.create({
    sector,
    observaciones,
    vigilante: req.user.nombre,
    idusuario: req.user.id
  })
  res.status(201).json(ronda)
}

export async function actualizar(req, res) {
  const ronda = await buscarConPermiso(req.params.id, req.user)
  if (req.body.sector !== undefined) ronda.sector = req.body.sector
  if (req.body.observaciones !== undefined) ronda.observaciones = req.body.observaciones
  await ronda.save()
  res.json(ronda)
}

export async function eliminar(req, res) {
  const ronda = await Ronda.findByIdAndDelete(req.params.id)
  if (!ronda) throw new HttpError(404, 'Ronda no encontrada')
  res.json({ mensaje: 'Ronda eliminada correctamente' })
}
