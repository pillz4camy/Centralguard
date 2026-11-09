import { Schema, model } from 'mongoose';

const vehiculoSchema = new Schema(
  {
    placa: { 
      type: String, 
      required: true, 
      unique: true, 
      uppercase: true, 
      trim: true, 
      maxlength: 15 
    },
    tipo: { type: String, enum: ['automóvil', 'motocicleta', 'bicicleta', 'camión', 'otro'], default: 'automóvil' },
    marca: { type: String, trim: true, maxlength: 50 },
    modelo: { type: String, trim: true, maxlength: 50 },
    color: { type: String, trim: true, maxlength: 20 }
  },
  { 
    collection: 'vehiculos', 
    timestamps: true, 
    versionKey: false 
  }
);

export default model('Vehiculo', vehiculoSchema);