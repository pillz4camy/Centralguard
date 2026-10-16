const { Schema, model } = require('mongoose');

const asignacionSchema = new Schema(
  {
    idusuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true, index: true },
    idequipos: { type: Schema.Types.ObjectId, ref: 'Equipo', required: true, index: true },
    fecha_entrega: { type: Date, default: Date.now },
    fecha_devolucion: { type: Date, default: null },
    observaciones_entrega: { type: String, trim: true, maxlength: 255 },
  },
  { collection: 'asignacion_equipo', versionKey: false }
);


asignacionSchema.index(
  { idequipos: 1 },
  { unique: true, partialFilterExpression: { fecha_devolucion: { $type: 'null' } }, name: 'equipo_una_asignacion_activa' }
);

module.exports = model('AsignacionEquipo', asignacionSchema);
