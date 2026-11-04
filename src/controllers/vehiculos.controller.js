import Vehiculo, { ESTADOS, TIPOS_REGISTRO, TIPOS_VEHICULO } from '../models/Vehiculo.js'
import { HttpError } from '../utils/httpError.js'

const FECHA = /^\d{4}-\d{2}-\d{2}$/
const esVigilante = (user) => user.idroles === 3
const escapar = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

function aFecha(texto, nombre, finDeDia = false) {
  if (!FECHA.test(texto)) throw new HttpError(400, `${nombre} debe tener formato YYYY-MM-DD`)
  const d = new Date(`${texto}T${finDeDia ? '23:59:59.999' : '00:00:00'}`)
  if (isNaN(d)) throw new HttpError(400, `${nombre} no es una fecha válida`)
  return d
}

function validarEnum(valor, permitidos, nombre) {
  if (valor && !permitidos.includes(valor)) throw new HttpError(400, `${nombre} debe ser: ${permitidos.join(', ')}`)
}

async function verificarDuplicado(v) {
  if (v.estado !== 'dentro') return
  const hay = await Vehiculo.exists({ placa: v.placa, estado: 'dentro', _id: { $ne: v._id } })
  if (hay) throw new HttpError(409, `El vehículo con placa ${v.placa} ya está registrado dentro. Registra su salida primero.`)
}

export async function listar(req, res) {
  const { placa, estado, tipo_registro, tipo_vehiculo, desde, hasta } = req.query
  const page = Math.max(parseInt(req.query.page) || 1, 1)
  const limit = Math.min(Math.max(parseInt(req.query.limit) || 20, 1), 100)

  validarEnum(estado, ESTADOS, 'estado')
  validarEnum(tipo_registro, TIPOS_REGISTRO, 'tipo_registro')
  validarEnum(tipo_vehiculo, TIPOS_VEHICULO, 'tipo_vehiculo')

  const filtro = {}
  if (estado) filtro.estado = estado
  if (tipo_registro) filtro.tipo_registro = tipo_registro
  if (tipo_vehiculo) filtro.tipo_vehiculo = tipo_vehiculo
  if (placa) filtro.placa = { $regex: escapar(placa.toUpperCase().replace(/[^A-Z0-9]/g, '')) }
  if (desde || hasta) {
    filtro.fecha_ingreso = {}
    if (desde) filtro.fecha_ingreso.$gte = aFecha(desde, 'desde')
    if (hasta) filtro.fecha_ingreso.$lte = aFecha(hasta, 'hasta', true)
  }

  const [datos, total] = await Promise.all([
    Vehiculo.find(filtro).sort({ fecha_ingreso: -1 }).skip((page - 1) * limit).limit(limit),
    Vehiculo.countDocuments(filtro)
  ])
  res.json({ total, page, paginas: Math.ceil(total / limit), datos })
}

export async function obtener(req, res) {
  const v = await Vehiculo.findById(req.params.id)
  if (!v) throw new HttpError(404, 'Registro de vehículo no encontrado')
  res.json(v)
}

export async function crear(req, res) {
  const { placa, tipo_vehiculo, marca, color, tipo_registro, propietario, destino, observaciones } = req.body
  const v = new Vehiculo({
    placa, tipo_vehiculo, marca, color, tipo_registro, propietario, destino, observaciones,
    idusuario: req.user.id,
    vigilante: req.user.nombre
  })
  await v.validate()
  await verificarDuplicado(v)
  await v.save()
  res.status(201).json(v)
}

export async function actualizar(req, res) {
  const v = await Vehiculo.findById(req.params.id)
  if (!v) throw new HttpError(404, 'Registro de vehículo no encontrado')
  if (esVigilante(req.user) && String(v.idusuario) !== String(req.user.id)) {
    throw new HttpError(403, 'Este registro lo hizo otro vigilante')
  }

  for (const campo of ['placa', 'tipo_vehiculo', 'marca', 'color', 'tipo_registro', 'propietario', 'destino', 'observaciones']) {
    if (req.body[campo] !== undefined) v[campo] = req.body[campo]
  }
  await v.validate()
  await verificarDuplicado(v)
  await v.save()
  res.json(v)
}

// Cualquier vigilante puede registrar la salida, aunque la entrada la haya hecho otro turno
export async function registrarSalida(req, res) {
  const v = await Vehiculo.findById(req.params.id)
  if (!v) throw new HttpError(404, 'Registro de vehículo no encontrado')
  if (v.estado === 'salio') throw new HttpError(409, 'Este vehículo ya tiene la salida registrada')

  v.estado = 'salio'
  v.fecha_salida = new Date()
  v.vigilante_salida = req.user.nombre
  await v.save()
  res.json(v)
}

export async function eliminar(req, res) {
  const v = await Vehiculo.findByIdAndDelete(req.params.id)
  if (!v) throw new HttpError(404, 'Registro de vehículo no encontrado')
  res.json({ mensaje: 'Registro eliminado correctamente' })
}
