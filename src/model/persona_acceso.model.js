import { Schema, model } from 'mongoose';

export const TIPOS_PERSONA = ['residente', 'visitante', 'empleado', 'proveedor'];

const personaAccesoSchema = new Schema(
  {
    primer_nombre: { 
      type: String, 
      required: true, 
      trim: true, 
      maxlength: 50 
    },
    primer_apellido: { 
      type: String, 
      required: true, 
      trim: true, 
      maxlength: 50 
    },
    tipo_persona: { 
      type: String, 
      enum: TIPOS_PERSONA, 
      required: true,
      default: 'visitante'
    },
    empresa_procedencia: { 
      type: String, 
      trim: true, 
      maxlength: 100,
      default: null
    }
  },
  { 
    collection: 'persona_acceso', 
    timestamps: true, 
    versionKey: false 
  }
);

personaAccesoSchema.index({ primer_nombre: 1, primer_apellido: 1 });
personaAccesoSchema.index({ tipo_persona: 1 });

export default model('PersonaAcceso', personaAccesoSchema);