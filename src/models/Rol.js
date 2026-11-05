import mongoose from 'mongoose'

const rolSchema = new mongoose.Schema({
  idroles: { type: Number, required: [true, 'El idroles es obligatorio'], min: [1, 'idroles debe ser mayor a 0'], unique: true },
  nombre_rol: { type: String, required: [true, 'El nombre del rol es obligatorio'], trim: true, minlength: [3, 'El nombre debe tener mínimo 3 caracteres'], maxlength: 40 },
  descripcion: { type: String, trim: true, default: '', maxlength: 200 }
}, { timestamps: true })

// El nombre no se repite, sin importar mayúsculas ni tildes ("Supervisor" = "supervisor")
rolSchema.index({ nombre_rol: 1 }, { unique: true, collation: { locale: 'es', strength: 1 } })

export default mongoose.model('Rol', rolSchema)
