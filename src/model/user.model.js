import { Schema, model } from 'mongoose';

export const ROLES_USUARIO = ['administrador', 'vigilante'];
export const TIPOS_DOCUMENTO = ['CC', 'CE', 'PASAPORTE', 'PEP'];

const userSchema = new Schema(
  {
    nombre: { type: String, required: true, trim: true, maxlength: 50 },
    apellido: { type: String, required: true, trim: true, maxlength: 50 },
    correo: { 
      type: String, 
      required: true, 
      unique: true, 
      lowercase: true, 
      trim: true 
    },
    contrasenia: { type: String, required: true },
    documento: {
      tipo: { type: String, enum: TIPOS_DOCUMENTO, default: 'CC' },
      numero: { type: String, required: true, trim: true }
    },
    telefono: {
      tipo: { type: String, enum: ['móvil', 'fijo', 'emergencia'], default: 'móvil' },
      numero: { type: String, trim: true }
    },
    rol: { 
      type: String, 
      enum: ROLES_USUARIO, 
      default: 'vigilante' 
    },
    activo: { type: Boolean, default: true }
  },
  { 
    collection: 'usuarios', 
    timestamps: true, 
    versionKey: false 
  }
);

userSchema.index({ 'documento.numero': 1 });

export default model('User', userSchema);