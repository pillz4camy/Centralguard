import { Schema, model } from 'mongoose';

const rondaSchema = new Schema(
  {
    hora_marcacion_inicio: { type: String, required: true, trim: true }, 
    hora_marcacion_fin: { type: String, trim: true, default: null },   
    puntos_validados: { type: String, trim: true, maxlength: 255 },        
    observaciones_ronda: { type: String, trim: true },
  },
  { collection: 'rondas', timestamps: true, versionKey: false }
);

rondaSchema.index({ createdAt: -1 });

export default model('Ronda', rondaSchema);