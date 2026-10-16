const { Schema, model } = require('mongoose');

const usuarioSchema = new Schema(
  {
    correo: { type: String, required: true, unique: true, lowercase: true, trim: true },
    contrasena: { type: String, required: true, select: false }, // hash bcrypt, nunca sale en las consultas
    nombre_completo: { type: String, required: true, trim: true, maxlength: 100 },
    idroles: { type: Schema.Types.ObjectId, ref: 'Rol', required: true },
    fecha_creacion: { type: Date, default: Date.now },
  },
  { collection: 'usuarios', versionKey: false }
);

module.exports = model('Usuario', usuarioSchema);
