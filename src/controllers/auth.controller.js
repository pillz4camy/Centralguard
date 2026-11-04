import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import Usuario from '../models/Usuario.js'
import { HttpError } from '../utils/httpError.js'

const firmar = (u) => jwt.sign(
  { id: u._id, idroles: u.idroles, nombre: u.nombre },
  process.env.JWT_SECRET,
  { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
)

export async function registrar(req, res) {
  const { usuario, contrasena, nombre, apellido } = req.body
  if (!usuario || !contrasena || !nombre) throw new HttpError(400, 'usuario, contrasena y nombre son obligatorios')
  if (String(contrasena).length < 6) throw new HttpError(400, 'La contraseña debe tener mínimo 6 caracteres')

  // El registro público siempre crea vigilantes (rol 3)
  const u = await Usuario.create({
    usuario, nombre, apellido,
    contrasena: await bcrypt.hash(String(contrasena), 10),
    idroles: 3
  })
  res.status(201).json({ id: u._id, usuario: u.usuario, nombre: u.nombre, idroles: u.idroles })
}

export async function login(req, res) {
  const { usuario, contrasena } = req.body
  if (!usuario || !contrasena) throw new HttpError(400, 'usuario y contrasena son obligatorios')

  const u = await Usuario.findOne({ usuario: String(usuario).trim().toLowerCase() }).select('+contrasena')
  const ok = u && await bcrypt.compare(String(contrasena), u.contrasena)
  if (!ok) throw new HttpError(401, 'Usuario o contraseña incorrectos')

  res.json({
    token: firmar(u),
    usuario: { id: u._id, usuario: u.usuario, nombre: u.nombre, apellido: u.apellido, idroles: u.idroles }
  })
}
