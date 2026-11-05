import { Schema, model } from 'mongoose';

export const ESTADOS_TURNO = ['activo', 'finalizado', 'cancelado'];

const turnoSchema = new Schema(
  {
    fecha: { type: Date, required: true, default: Date.now },
    hora_inicio: { type: String, required: true, trim: true }, 
    hora_fin: { type: String, trim: true, default: null },      
    estado: { type: String, enum: ESTADOS_TURNO, default: 'activo' },
  },
  { collection: 'turnos', timestamps: true, versionKey: false }
);

turnoSchema.index({ fecha: -1 });
turnoSchema.index({ estado: 1 });

export default model('Turno', turnoSchema);