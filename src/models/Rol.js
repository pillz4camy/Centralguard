const { Schema, model } = require('mongoose');

const rolSchema = new Schema(
  { nombre_rol: { type: String, required: true, unique: true, trim: true } },
  { collection: 'roles', versionKey: false }
);

module.exports = model('Rol', rolSchema);
