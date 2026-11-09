import { Schema, model } from 'mongoose';

export const TIPOS_PERSONA = ['residente', 'visitante', 'empleado', 'proveedor', 'domiciliario'];

const personaAccesoSchema = new Schema(
  {
    primer_nombre: { type: String, required: true, trim: true, maxlength: 50 },
    primer_apellido: { type: String, required: true, trim: true, maxlength: 50 },
    documento: {
      tipo: { type: String, default: 'CC' },
      numero: { type: String, required: true, trim: true, unique: true }
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
    collection: 'personas_acceso', 
    timestamps: true, 
    versionKey: false 
  }
);

export default model('PersonaAcceso', personaAccesoSchema);
