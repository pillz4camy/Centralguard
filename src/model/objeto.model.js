import { Schema, model } from 'mongoose';

export const ESTADOS = ['en_custodia', 'entregado'];

const objetoSchema = new Schema(
  {
    nombre_objeto: { 
      type: String, 
      required: true, 
      trim: true, 
      maxlength: 45 
    },
    descripcion_detallada: { 
      type: String, 
      trim: true 
    },
    fecha_hallazgo: { 
      type: String, 
      trim: true 
    },
    estado: { 
      type: String, 
      enum: ESTADOS, 
      default: 'en_custodia' 
    }
  },
  { 
    collection: 'objeto_perdido', 
    timestamps: true, 
    versionKey: false 
  }
);

export default model('ObjetoPerdido', objetoSchema);