import { Schema, model } from 'mongoose';

export const TIPOS_NOVEDAD = ['Seguridad', 'Mantenimiento', 'Convivencia', 'Emergencia', 'Otra'];
export const ESTADOS_NOVEDAD = ['Pendiente', 'En Gestión', 'Resuelto', 'Cancelado'];

const novedadSchema = new Schema(
  {
    turno: { 
      type: Schema.Types.ObjectId, 
      ref: 'Turno', 
      required: true 
    },
    tipo_novedad: { 
      type: String, 
      enum: TIPOS_NOVEDAD, 
      required: true, 
      default: 'Seguridad' 
    },
    hora_reporte: { type: Date, default: Date.now, required: true },
    descripcion_hechos: { type: String, required: true, trim: true },
    evidencias: [
      {
        url_imagen: { type: String, required: true, trim: true },
        fecha_captura: { type: Date, default: Date.now }
      }
    ],
    estado: { 
      type: String, 
      enum: ESTADOS_NOVEDAD, 
      default: 'Pendiente' 
    }
  },
  { 
    collection: 'novedades', 
    timestamps: true, 
    versionKey: false 
  }
);

novedadSchema.index({ turno: 1, createdAt: -1 });
novedadSchema.index({ estado: 1 });

export default model('Novedad', novedadSchema);