import Rol from '../models/Rol.js'
import Usuario from '../models/Usuario.js'
import { HttpError } from '../utils/httpError.js'
import { leerIdRol } from './roles.controller.js'

export async function asignarRol(req, res) {
  const idroles = leerIdRol(req.body.idroles)

  if (!(await Rol.exists({ idroles }))) throw new HttpError(400, `El rol ${idroles} no existe`)
  // Evita que el único admin se quite el permiso y deje el sistema sin administrador
  if (String(req.params.id) === String(req.user.id) && idroles !== 1) {
    throw new HttpError(409, 'No puedes quitarte a ti mismo el rol de administrador')
  }

  const u = await Usuario.findByIdAndUpdate(req.params.id, { idroles }, { new: true }).select('usuario nombre apellido idroles')
  if (!u) throw new HttpError(404, 'Usuario no encontrado')
  res.json(u)
}
