import { Schema, model } from 'mongoose';

export const ESTADOS = ['pendiente', 'aprobado', 'rechazado'];
export const ROLES_USUARIO = ['administrador', 'supervisor', 'vigilante'];

const usuarioSchema = new Schema(
  {
    nombre: { type: String, required: true, trim: true, maxlength: 80 },
    apellido: { type: String, required: true, trim: true, maxlength: 80 },
    documento: { type: String, required: true, unique: true, trim: true },
    correo: { type: String, required: true, unique: true, trim: true, lowercase: true, maxlength: 254 },
    telefono: { type: String, trim: true },
    contrasena: { type: String, required: true, select: false },
    rol: { type: String, enum: ROLES_USUARIO, default: 'vigilante' },
    estado_registro: { type: String, enum: ESTADOS, default: 'pendiente' },
  },
  { collection: 'usuarios', timestamps: true, versionKey: false }
);

export default model('Usuario', usuarioSchema);
