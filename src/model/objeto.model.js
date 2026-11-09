import { Schema, model } from 'mongoose';

export const ESTADOS_OBJETO = ['en_custodia', 'entregado', 'descartado'];

const objetoSchema = new Schema(
  {
    puesto_vigilancia: { 
      type: Schema.Types.ObjectId, 
      ref: 'Puesto', 
      default: null 
    },
    nombre_objeto: { type: String, required: true, trim: true, maxlength: 100 },
    descripcion_detallada: { type: String, trim: true },
    fecha_hallazgo: { type: Date, default: Date.now, required: true },
    entregado_a: { type: String, trim: true, default: null }, 
    fecha_entrega: { type: Date, default: null },
    evidencias: [
      {
        url_imagen: { type: String, required: true, trim: true },
        fecha_captura: { type: Date, default: Date.now }
      }
    ],
    estado: { 
      type: String, 
      enum: ESTADOS_OBJETO, 
      default: 'en_custodia' 
    }
  },
  { 
    collection: 'objetos_perdidos', 
    timestamps: true, 
    versionKey: false 
  }
);

objetoSchema.index({ estado: 1, createdAt: -1 });

export default model('ObjetoPerdido', objetoSchema);