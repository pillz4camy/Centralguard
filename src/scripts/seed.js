// Crea un admin, un supervisor y un vigilante de prueba: npm run seed
import 'dotenv/config'
import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'
import Usuario from '../models/Usuario.js'

await mongoose.connect(process.env.MONGODB_URI)

const base = [
  { usuario: 'admin@centralguard.com', nombre: 'Admin', idroles: 1 },
  { usuario: 'supervisor@centralguard.com', nombre: 'Supervisor', idroles: 2 },
  { usuario: 'vigilante@centralguard.com', nombre: 'Vigilante', apellido: 'Prueba', idroles: 3 }
]

for (const u of base) {
  const existe = await Usuario.findOne({ usuario: u.usuario })
  if (existe) { console.log('Ya existe:', u.usuario); continue }
  await Usuario.create({ ...u, contrasena: await bcrypt.hash('123456', 10) })
  console.log('Creado:', u.usuario, '(contraseña: 123456)')
}

await mongoose.disconnect()
