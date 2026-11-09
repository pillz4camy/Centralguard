import { Schema, model } from 'mongoose';

export const ESTADOS_TURNO = ['activo', 'finalizado', 'cancelado'];

const turnoSchema = new Schema(
  {
    conjunto: { 
      type: Schema.Types.ObjectId, 
      ref: 'Conjunto', 
      required: true 
    },
    empleado: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    puesto_vigilancia: { 
      type: Schema.Types.ObjectId, 
      ref: 'Puesto', 
      required: true 
    },
    fecha: { type: Date, required: true, default: Date.now },
    hora_inicio: { type: Date, required: true, default: Date.now },
    hora_fin: { type: Date, default: null },
    estado: { type: String, enum: ESTADOS_TURNO, default: 'activo' },
    observaciones: { type: String, trim: true }
  },
  { 
    collection: 'turnos', 
    timestamps: true, 
    versionKey: false 
  }
);

turnoSchema.index({ empleado: 1, fecha: -1 });
turnoSchema.index({ conjunto: 1, estado: 1 });

export default model('Turno', turnoSchema);