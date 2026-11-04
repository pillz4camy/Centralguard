import mongoose from 'mongoose'

const usuarioSchema = new mongoose.Schema({
  usuario: { type: String, required: [true, 'El usuario es obligatorio'], unique: true, trim: true, lowercase: true },
  contrasena: { type: String, required: true, select: false },
  nombre: { type: String, required: [true, 'El nombre es obligatorio'], trim: true },
  apellido: { type: String, trim: true, default: '' },
  idroles: { type: Number, enum: [1, 2, 3], default: 3 } // 1 admin, 2 supervisor, 3 vigilante
}, { timestamps: true })

export default mongoose.model('Usuario', usuarioSchema)
