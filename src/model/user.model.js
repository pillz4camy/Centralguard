import { Schema, model } from 'mongoose';

const userSchema = new Schema(
  {
    correo: { type: String, required: true, unique: true, lowercase: true, trim: true },
    contrasenia: { type: String, required: true, select: false },
    nombre: { type: String, required: true, trim: true, maxlength: 15 },
    apellido: { type: String, required: true, trim: true, maxlength: 45 },
    fecha_creacion: { type: Date, default: Date.now },
  },
  { collection: 'usuarios', versionKey: false }
);

export default model('User', userSchema);