import { Schema, model } from 'mongoose';

const pedidoSchema = new Schema(
  {
    nombre_pedido: {
      type: String,
      required: true
    },
    descripcion: {
      type: String,
      required: true
    },
    nombre_destinatario: {
      type: String,
      required: true
    },
    hora_llegada: {
      type: String,
      required: true
    },
    estado: {
      type: String,
      enum: ['Pendiente', 'Entregado', 'Cancelado'],
      required: true
    }
  },
  {
    timestamps: true
  }
);

export default model('Pedido', pedidoSchema);