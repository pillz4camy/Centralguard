// Crea los 3 roles base y un usuario de prueba por rol: npm run seed
import 'dotenv/config'
import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'
import Rol from '../models/Rol.js'
import Usuario from '../models/Usuario.js'

await mongoose.connect(process.env.MONGODB_URI)

const roles = [
  { idroles: 1, nombre_rol: 'Administrador', descripcion: 'Gestiona cuentas, personal y validación de registros' },
  { idroles: 2, nombre_rol: 'Supervisor', descripcion: 'Programa turnos, asigna equipos y revisa los reportes' },
  { idroles: 3, nombre_rol: 'Vigilante', descripcion: 'Registra novedades, rondas, accesos y pedidos' }
]
for (const r of roles) {
  if (await Rol.exists({ idroles: r.idroles })) { console.log('Ya existe el rol', r.idroles); continue }
  await Rol.create(r)
  console.log('Rol creado:', r.idroles, r.nombre_rol)
}

const usuarios = [
  { usuario: 'admin@centralguard.com', nombre: 'Admin', idroles: 1 },
  { usuario: 'supervisor@centralguard.com', nombre: 'Supervisor', idroles: 2 },
  { usuario: 'vigilante@centralguard.com', nombre: 'Vigilante', apellido: 'Prueba', idroles: 3 }
]
for (const u of usuarios) {
  if (await Usuario.exists({ usuario: u.usuario })) { console.log('Ya existe:', u.usuario); continue }
  await Usuario.create({ ...u, contrasena: await bcrypt.hash('123456', 10) })
  console.log('Creado:', u.usuario, '(contraseña: 123456)')
}

await mongoose.disconnect()
