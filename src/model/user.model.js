import { Schema, model } from 'mongoose';

export const ROLES_USUARIO = ['administrador', 'supervisor', 'vigilante'];

const userSchema = new Schema(
  {
    nombre: { type: String, required: true, trim: true },
    correo: { type: String, required: true, unique: true, lowercase: true, trim: true },
    contrasenia: { type: String, required: true },
    rol: { type: String, enum: ROLES_USUARIO, default: 'vigilante' },
  },
  { collection: 'users', timestamps: true, versionKey: false }
);

export default model('User', userSchema);