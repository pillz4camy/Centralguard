import { Schema, model } from 'mongoose';

const rondaSchema = new Schema(
  {
    turno: { 
      type: Schema.Types.ObjectId, 
      ref: 'Turno', 
      required: true 
    },
    hora_marcacion_inicio: { type: Date, required: true, default: Date.now },
    hora_marcacion_fin: { type: Date, default: null },
    puestos_validados: [{ type: String, trim: true }], 
    observaciones_ronda: { type: String, trim: true }
  },
  { 
    collection: 'rondas', 
    timestamps: true, 
    versionKey: false 
  }
);

rondaSchema.index({ turno: 1, createdAt: -1 });

export default model('Ronda', rondaSchema);