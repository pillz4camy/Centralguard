import { Schema, model } from 'mongoose';

export const ESTADOS_PEDIDO = ['Pendiente', 'Entregado', 'Devuelto', 'Cancelado'];

const pedidoSchema = new Schema(
  {
    registro_acceso: { 
      type: Schema.Types.ObjectId, 
      ref: 'RegistroAcceso', 
      default: null 
    },
    nombre_pedido: { type: String, required: true, trim: true },
    descripcion: { type: String, trim: true },
    nombre_destinatario: { type: String, required: true, trim: true },
    apartamento_destino: { type: String, required: true, trim: true },
    hora_llegada: { type: Date, default: Date.now, required: true },
    hora_entrega: { type: Date, default: null },
    estado: { 
      type: String, 
      enum: ESTADOS_PEDIDO, 
      default: 'Pendiente' 
    }
  },
  { 
    collection: 'pedidos', 
    timestamps: true, 
    versionKey: false 
  }
);

pedidoSchema.index({ estado: 1, apartamento_destino: 1 });
pedidoSchema.index({ hora_llegada: -1 });

export default model('Pedido', pedidoSchema);