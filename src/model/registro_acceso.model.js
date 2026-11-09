import { Schema, model } from 'mongoose';

const registroAccesoSchema = new Schema(
  {
    turno: { 
      type: Schema.Types.ObjectId, 
      ref: 'Turno', 
      required: true 
    },
    persona: { 
      type: Schema.Types.ObjectId, 
      ref: 'PersonaAcceso', 
      required: true 
    },
    vehiculo: { 
      type: Schema.Types.ObjectId, 
      ref: 'Vehiculo', 
      default: null 
    },
    apartamento_destino: { 
      type: String, 
      required: true, 
      trim: true, 
      maxlength: 30 
    },
    hora_entrada: { 
      type: Date, 
      required: true, 
      default: Date.now 
    },
    hora_salida: { 
      type: Date, 
      default: null 
    },
    observaciones_acceso: { 
      type: String, 
      trim: true 
    }
  },
  { 
    collection: 'registros_acceso', 
    timestamps: true, 
    versionKey: false 
  }
);

registroAccesoSchema.index({ hora_entrada: -1 });
registroAccesoSchema.index({ hora_salida: 1 });
registroAccesoSchema.index({ apartamento_destino: 1 });

export default model('RegistroAcceso', registroAccesoSchema);
