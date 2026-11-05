import { Schema, model } from 'mongoose';

export const ESTADOS_PEDIDO = ['Pendiente', 'Entregado', 'Cancelado'];

const pedidoSchema = new Schema(
  {
    nombre_pedido: {
      type: String,
      required: true,
      trim: true
    },
    descripcion: {
      type: String,
      required: true,
      trim: true
    },
    nombre_destinatario: {
      type: String,
      required: true,
      trim: true
    },
    hora_llegada: {
      type: String,
      required: true,
      trim: true
    },
    estado: {
      type: String,
      enum: ESTADOS_PEDIDO,
      required: true,
      default: 'Pendiente'
    }
  },
  {
    collection: 'pedidos',
    timestamps: true,
    versionKey: false
  }
);

pedidoSchema.index({ createdAt: -1 });

export default model('Pedido', pedidoSchema);