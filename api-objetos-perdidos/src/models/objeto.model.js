import { Schema, model } from 'mongoose';

export const ESTADOS = ['en_custodia', 'entregado'];

const objetoSchema = new Schema(
  {
    articulo: { type: String, required: true, trim: true, maxlength: 100 },
    descripcion: { type: String, trim: true, maxlength: 255 },
    ubicacion_hallazgo: { type: String, trim: true, maxlength: 150 },
    estado: { type: String, enum: ESTADOS, default: 'en_custodia' },
    entregado_a: { type: String, trim: true, maxlength: 100 },
    fecha_entrega: { type: Date, default: null },
    idusuario: { type: String, required: true, index: true }, // vigilante que lo registró
    fecha_registro: { type: Date, default: Date.now },
  },
  { collection: 'objetos_perdidos', timestamps: true, versionKey: false }
);

objetoSchema.index({ fecha_registro: -1 });
objetoSchema.index({ estado: 1 });

export default model('ObjetoPerdido', objetoSchema);
