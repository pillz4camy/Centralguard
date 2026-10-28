import { Schema, model } from 'mongoose';

const ESTADOS = ['Bueno', 'Regular', 'Dañado'];

const equipmentSchema = new Schema(
  {
    nombre_activo: { type: String, required: true, trim: true, maxlength: 100 },
    serial_unico: { type: String, required: true, unique: true, trim: true, maxlength: 50 },
    estado: { type: String, required: true, enum: ESTADOS },
  },
  { collection: 'equipo', versionKey: false }
);

export default model('Equipment', equipmentSchema);