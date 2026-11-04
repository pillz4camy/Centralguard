import mongoose from 'mongoose'

// Placas colombianas: carros ABC123 y motos ABC12D (se aceptan con guion o espacios: ABC-123)
const PLACA = /^[A-Z]{3}[0-9]{2}[0-9A-Z]$/
export const TIPOS_VEHICULO = ['carro', 'moto', 'camioneta', 'otro']
export const TIPOS_REGISTRO = ['residente', 'visitante']
export const ESTADOS = ['dentro', 'salio']

const vehiculoSchema = new mongoose.Schema({
  placa: {
    type: String,
    required: [true, 'La placa es obligatoria'],
    set: (v) => String(v ?? '').toUpperCase().replace(/[^A-Z0-9]/g, ''),
    match: [PLACA, 'La placa no es válida (ej: ABC123 o ABC12D)']
  },
  tipo_vehiculo: { type: String, enum: { values: TIPOS_VEHICULO, message: 'tipo_vehiculo debe ser: ' + TIPOS_VEHICULO.join(', ') }, default: 'carro' },
  marca: { type: String, trim: true, default: '', maxlength: 50 },
  color: { type: String, trim: true, default: '', maxlength: 30 },
  tipo_registro: { type: String, enum: { values: TIPOS_REGISTRO, message: 'tipo_registro debe ser: ' + TIPOS_REGISTRO.join(', ') }, default: 'visitante' },
  propietario: { type: String, required: [true, 'El nombre del propietario o conductor es obligatorio'], trim: true, maxlength: 100 },
  destino: { type: String, required: [true, 'El destino / apartamento es obligatorio'], trim: true, maxlength: 60 },
  observaciones: { type: String, trim: true, default: '', maxlength: 300 },

  estado: { type: String, enum: ESTADOS, default: 'dentro', index: true },
  fecha_ingreso: { type: Date, default: Date.now, index: true },
  fecha_salida: { type: Date, default: null },

  idusuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  vigilante: { type: String, trim: true, default: 'Vigilante' },
  vigilante_salida: { type: String, trim: true, default: '' }
}, { timestamps: true })

// Un mismo vehículo no puede estar "dentro" dos veces a la vez (protege contra registros simultáneos)
vehiculoSchema.index({ placa: 1 }, { unique: true, partialFilterExpression: { estado: 'dentro' } })

export default mongoose.model('Vehiculo', vehiculoSchema)
