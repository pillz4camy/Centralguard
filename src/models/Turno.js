import mongoose from 'mongoose'

const HORA = /^([01]\d|2[0-3]):[0-5]\d$/
const FECHA = /^\d{4}-\d{2}-\d{2}$/

const fechaReal = (v) => {
  try { return new Date(`${v}T00:00:00Z`).toISOString().slice(0, 10) === v } catch { return false }
}

const turnoSchema = new mongoose.Schema({
  idusuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: [true, 'El vigilante es obligatorio'], index: true },
  vigilante: { type: String, required: true, trim: true },
  supervisor: { type: String, trim: true, default: 'Supervisor' },
  fecha: {
    type: String,
    required: [true, 'La fecha es obligatoria'],
    match: [FECHA, 'La fecha debe tener formato YYYY-MM-DD'],
    validate: { validator: fechaReal, message: 'La fecha no es válida' },
    index: true
  },
  hora_inicio: { type: String, required: [true, 'La hora de inicio es obligatoria'], match: [HORA, 'hora_inicio debe tener formato HH:mm (24 horas)'] },
  hora_fin: { type: String, required: [true, 'La hora de fin es obligatoria'], match: [HORA, 'hora_fin debe tener formato HH:mm (24 horas)'] },
  puesto: { type: String, required: [true, 'El puesto es obligatorio'], trim: true, maxlength: 100 },
  observaciones: { type: String, trim: true, default: '', maxlength: 300 }
}, { timestamps: true })

export default mongoose.model('Turno', turnoSchema)
