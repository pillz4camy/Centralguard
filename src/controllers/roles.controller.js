import Rol from '../models/Rol.js'
import Usuario from '../models/Usuario.js'
import { HttpError } from '../utils/httpError.js'

// Roles base del sistema: sin ellos la app deja de funcionar, no se pueden borrar
export const ROLES_BASE = [1, 2, 3]

export function leerIdRol(valor) {
  const n = Number(valor)
  if (!Number.isInteger(n) || n < 1) throw new HttpError(400, 'idroles debe ser un número entero mayor a 0')
  return n
}

const escapar = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const mismoNombre = (nombre) => Rol.findOne({ nombre_rol: nombre }).collation({ locale: 'es', strength: 1 })

async function buscarRol(idroles) {
  const rol = await Rol.findOne({ idroles })
  if (!rol) throw new HttpError(404, 'Rol no encontrado')
  return rol
}

export async function listar(req, res) {
  const filtro = {}
  if (req.query.buscar) filtro.nombre_rol = { $regex: escapar(String(req.query.buscar).trim()), $options: 'i' }
  const datos = await Rol.find(filtro).sort({ idroles: 1 })
  res.json({ total: datos.length, datos })
}

export async function obtener(req, res) {
  res.json(await buscarRol(leerIdRol(req.params.idroles)))
}

export async function crear(req, res) {
  const { nombre_rol, descripcion } = req.body
  let idroles
  if (req.body.idroles !== undefined) {
    idroles = leerIdRol(req.body.idroles)
  } else {
    const ultimo = await Rol.findOne().sort({ idroles: -1 })
    idroles = (ultimo?.idroles || 0) + 1
  }

  const rol = new Rol({ idroles, nombre_rol, descripcion })
  await rol.validate()
  if (await Rol.exists({ idroles })) throw new HttpError(409, `Ya existe un rol con idroles ${idroles}`)
  if (await mismoNombre(rol.nombre_rol)) throw new HttpError(409, `Ya existe un rol llamado "${rol.nombre_rol}"`)
  await rol.save()
  res.status(201).json(rol)
}

export async function actualizar(req, res) {
  const rol = await buscarRol(leerIdRol(req.params.idroles))
  // El idroles no se cambia: los usuarios lo usan para apuntar a su rol
  if (req.body.nombre_rol !== undefined) rol.nombre_rol = req.body.nombre_rol
  if (req.body.descripcion !== undefined) rol.descripcion = req.body.descripcion
  await rol.validate()

  const repetido = await mismoNombre(rol.nombre_rol)
  if (repetido && String(repetido._id) !== String(rol._id)) {
    throw new HttpError(409, `Ya existe un rol llamado "${rol.nombre_rol}"`)
  }
  await rol.save()
  res.json(rol)
}

export async function eliminar(req, res) {
  const idroles = leerIdRol(req.params.idroles)
  const rol = await buscarRol(idroles)

  if (ROLES_BASE.includes(idroles)) {
    throw new HttpError(409, `"${rol.nombre_rol}" es un rol base del sistema y no se puede eliminar`)
  }
  const enUso = await Usuario.countDocuments({ idroles })
  if (enUso > 0) {
    throw new HttpError(409, `No se puede eliminar: hay ${enUso} usuario(s) con el rol "${rol.nombre_rol}". Cámbiales el rol primero.`)
  }
  await rol.deleteOne()
  res.json({ mensaje: 'Rol eliminado correctamente' })
}

export async function usuariosDelRol(req, res) {
  const rol = await buscarRol(leerIdRol(req.params.idroles))
  const usuarios = await Usuario.find({ idroles: rol.idroles }).select('usuario nombre apellido idroles').sort({ nombre: 1 })
  res.json({ rol, total: usuarios.length, usuarios })
}
