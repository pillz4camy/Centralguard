import mongoose from 'mongoose'
import Turno from '../models/Turno.js'
import Usuario from '../models/Usuario.js'
import { HttpError } from '../utils/httpError.js'

const FECHA = /^\d{4}-\d{2}-\d{2}$/
const esVigilante = (user) => user.idroles === 3
const nombreDe = (u) => `${u.nombre || ''} ${u.apellido || ''}`.trim() || u.usuario

const aMin = (h) => { const [H, M] = h.split(':').map(Number); return H * 60 + M }
// Si la hora de fin es menor o igual al inicio, el turno cruza la medianoche
const rango = (ini, fin) => { const a = aMin(ini); let b = aMin(fin); if (b <= a) b += 1440; return [a, b] }

async function buscarVigilante(idusuario) {
  if (!idusuario) throw new HttpError(400, 'idusuario es obligatorio')
  if (!mongoose.isValidObjectId(idusuario)) throw new HttpError(400, 'idusuario no es un id válido')
  const vig = await Usuario.findById(idusuario)
  if (!vig || vig.idroles !== 3) throw new HttpError(400, 'El idusuario no corresponde a un vigilante')
  return vig
}

// Un vigilante no puede tener dos turnos que se crucen el mismo día
async function verificarCruce(t, excluirId) {
  if (t.hora_inicio === t.hora_fin) throw new HttpError(400, 'hora_fin no puede ser igual a hora_inicio')
  const filtro = { idusuario: t.idusuario, fecha: t.fecha }
  if (excluirId) filtro._id = { $ne: excluirId }
  const otros = await Turno.find(filtro)
  const [a, b] = rango(t.hora_inicio, t.hora_fin)
  const cruza = otros.some(o => { const [c, d] = rango(o.hora_inicio, o.hora_fin); return a < d && c < b })
  if (cruza) throw new HttpError(409, 'El vigilante ya tiene un turno que se cruza en esa fecha y horario')
}

async function buscarConPermiso(id, user) {
  const turno = await Turno.findById(id)
  if (!turno) throw new HttpError(404, 'Turno no encontrado')
  if (esVigilante(user) && String(turno.idusuario) !== String(user.id)) {
    throw new HttpError(403, 'Este turno pertenece a otro vigilante')
  }
  return turno
}

export async function listar(req, res) {
  const { desde, hasta, puesto, idusuario } = req.query
  const page = Math.max(parseInt(req.query.page) || 1, 1)
  const limit = Math.min(Math.max(parseInt(req.query.limit) || 20, 1), 100)

  for (const [k, v] of Object.entries({ desde, hasta })) {
    if (v && !FECHA.test(v)) throw new HttpError(400, `${k} debe tener formato YYYY-MM-DD`)
  }

  const filtro = {}
  if (esVigilante(req.user)) filtro.idusuario = req.user.id
  else if (idusuario) filtro.idusuario = idusuario
  if (puesto) filtro.puesto = { $regex: puesto.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' }
  if (desde || hasta) {
    filtro.fecha = {}
    if (desde) filtro.fecha.$gte = desde
    if (hasta) filtro.fecha.$lte = hasta
  }

  const [datos, total] = await Promise.all([
    Turno.find(filtro).sort({ fecha: 1, hora_inicio: 1 }).skip((page - 1) * limit).limit(limit),
    Turno.countDocuments(filtro)
  ])
  res.json({ total, page, paginas: Math.ceil(total / limit), datos })
}

export async function obtener(req, res) {
  res.json(await buscarConPermiso(req.params.id, req.user))
}

export async function crear(req, res) {
  const { idusuario, fecha, hora_inicio, hora_fin, puesto, observaciones } = req.body
  const vig = await buscarVigilante(idusuario)

  const turno = new Turno({
    idusuario: vig._id,
    vigilante: nombreDe(vig),
    supervisor: req.user.nombre,
    fecha, hora_inicio, hora_fin, puesto, observaciones
  })
  await turno.validate()
  await verificarCruce(turno)
  await turno.save()
  res.status(201).json(turno)
}

export async function actualizar(req, res) {
  const turno = await Turno.findById(req.params.id)
  if (!turno) throw new HttpError(404, 'Turno no encontrado')

  if (req.body.idusuario !== undefined && String(req.body.idusuario) !== String(turno.idusuario)) {
    const vig = await buscarVigilante(req.body.idusuario)
    turno.idusuario = vig._id
    turno.vigilante = nombreDe(vig)
  }
  for (const campo of ['fecha', 'hora_inicio', 'hora_fin', 'puesto', 'observaciones']) {
    if (req.body[campo] !== undefined) turno[campo] = req.body[campo]
  }
  turno.supervisor = req.user.nombre

  await turno.validate()
  await verificarCruce(turno, turno._id)
  await turno.save()
  res.json(turno)
}

export async function eliminar(req, res) {
  const turno = await Turno.findByIdAndDelete(req.params.id)
  if (!turno) throw new HttpError(404, 'Turno no encontrado')
  res.json({ mensaje: 'Turno eliminado correctamente' })
}
