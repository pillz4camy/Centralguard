import { Schema, model } from 'mongoose';

const novedadSchema = new Schema(
  {
    hora_reporte: {
      type: String,
      required: true
    },
    descripcion_hechos: {
      type: String,
      required: true
    },
    estado: {
      type: String,
      enum: ['Activo', 'Inactivo', 'Pendiente', 'Resuelto'],
      required: true 
    }
  },
  {
    timestamps: true
  }
);

export default model('Novedad', novedadSchema);