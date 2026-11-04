import Usuario from '../models/Usuario.js'

// Lista de usuarios para que el supervisor elija a quién asignar un turno
export async function listar(req, res) {
  const filtro = {}
  if (req.query.idroles) filtro.idroles = Number(req.query.idroles)
  const datos = await Usuario.find(filtro).select('usuario nombre apellido idroles').sort({ nombre: 1 })
  res.json(datos)
}
