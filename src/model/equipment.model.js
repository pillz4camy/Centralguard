import { Schema, model } from 'mongoose';

export const ESTADOS_EQUIPO = ['Bueno', 'Regular', 'Dañado', 'En Mantenimiento', 'De Baja'];

const equipmentSchema = new Schema(
  {
    nombre_activo: { type: String, required: true, trim: true, maxlength: 100 },
    serial_unico: { type: String, required: true, unique: true, uppercase: true, trim: true },
    estado: { type: String, required: true, enum: ESTADOS_EQUIPO, default: 'Bueno' },
    observaciones: { type: String, trim: true }
  },
  { 
    collection: 'equipos', 
    timestamps: true, 
    versionKey: false 
  }
);

export default model('Equipment', equipmentSchema);