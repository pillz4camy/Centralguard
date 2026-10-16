const { Schema, model } = require('mongoose');

// Ajusta los valores del enum a los de tu ENUM en MySQL
const ESTADOS = ['Bueno', 'Regular', 'Dañado'];

const equipoSchema = new Schema(
  {
    nombre_activo: { type: String, required: true, trim: true, maxlength: 100 },
    serial_unico: { type: String, required: true, unique: true, trim: true, maxlength: 50 },
    estado: { type: String, required: true, enum: ESTADOS },
  },
  { collection: 'equipo', versionKey: false }
);

module.exports = model('Equipo', equipoSchema);
module.exports.ESTADOS = ESTADOS;
