import { Schema, model } from 'mongoose';

export const TIPOS = ['Portería', 'Recepción', 'Parqueadero', 'Ronda', 'Torre', 'Zona común', 'Otro'];

const puestoSchema = new Schema(
  {
    nombre: { type: String, required: true, unique: true, trim: true, maxlength: 100 },
    tipo: { type: String, enum: TIPOS, default: 'Otro' },
    ubicacion: { type: String, trim: true, maxlength: 150 },
    descripcion: { type: String, trim: true, maxlength: 255 },
    vigilantes_requeridos: { type: Number, min: 1, max: 50, default: 1 },
    activo: { type: Boolean, default: true },
  },
  { collection: 'puestos', timestamps: true, versionKey: false }
);

export default model('Puesto', puestoSchema);
