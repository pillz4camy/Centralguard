import mongoose from 'mongoose'

const rondaSchema = new mongoose.Schema({
  sector: { type: String, required: [true, 'El sector es obligatorio'], trim: true, maxlength: 120 },
  observaciones: { type: String, trim: true, default: '', maxlength: 500 },
  vigilante: { type: String, trim: true, default: 'Vigilante' },
  idusuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true, index: true },
  fecha_hora: { type: Date, default: Date.now, index: true }
}, { timestamps: true })

export default mongoose.model('Ronda', rondaSchema)
