import { Schema, model } from 'mongoose';

export const ESTADOS_NOVEDAD = ['Activo', 'Inactivo', 'Pendiente', 'Resuelto'];

const novedadSchema = new Schema(
  {
    hora_reporte: {
      type: String,
      required: true,
      trim: true
    },
    descripcion_hechos: {
      type: String,
      required: true,
      trim: true
    },
    estado: {
      type: String,
      enum: ESTADOS_NOVEDAD,
      required: true,
      default: 'Pendiente'
    }
  },
  {
    collection: 'novedades',
    timestamps: true,
    versionKey: false
  }
);

novedadSchema.index({ createdAt: -1 });

export default model('Novedad', novedadSchema);