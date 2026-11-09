import { Schema, model } from 'mongoose';

export const TIPOS_PUESTO = ['Portería Principal', 'Portería Vehicular', 'Recepción', 'Parqueadero', 'Torre', 'Ronda', 'Otro'];

const puestoSchema = new Schema(
  {
    nombre_identificador: { type: String, required: true, trim: true, maxlength: 100 },
    tipo_puesto: { type: String, enum: TIPOS_PUESTO, default: 'Portería Principal' },
    conjunto: { 
      type: Schema.Types.ObjectId, 
      ref: 'Conjunto', 
      required: true 
    },
    descripcion: { type: String, trim: true },
    activo: { type: Boolean, default: true }
  },
  {  
    collection: 'puestos_vigilancia', 
    timestamps: true, 
    versionKey: false 
  }
);

puestoSchema.index({ conjunto: 1, nombre_identificador: 1 });

export default model('Puesto', puestoSchema);