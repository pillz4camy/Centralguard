import { Schema, model } from 'mongoose';

const visitanteSchema = new Schema(
  {
    nombre: { type: String, required: true, trim: true, maxlength: 100 },
    documento: { type: String, trim: true },
    destino: { type: String, required: true, trim: true, maxlength: 100 },
    placa: { type: String, trim: true, uppercase: true },
    observaciones: { type: String, trim: true, maxlength: 255 },
    idusuario: { type: String, required: true, index: true }, // vigilante que registró el ingreso
    fecha_ingreso: { type: Date, default: Date.now },
    fecha_salida: { type: Date, default: null },
  },
  { collection: 'visitantes', timestamps: true, versionKey: false }
);

visitanteSchema.index({ fecha_ingreso: -1 });
visitanteSchema.index({ placa: 1 });

export default model('Visitante', visitanteSchema);
