import { Schema, model } from 'mongoose';

const conjuntoSchema = new Schema(
  {
    nombre_conjunto: { type: String, required: true, trim: true, maxlength: 120 },
    nit: { type: String, required: false, unique: true, sparse: true, trim: true },
    direccion: { type: String, required: true, trim: true, maxlength: 100 },
    correo_electronico: { type: String, lowercase: true, trim: true },
    telefono: {
      tipo: { type: String, default: 'fijo' },
      numero: { type: String, trim: true }
    },
    contacto_principal: {
      nombre: { type: String, trim: true, maxlength: 50 },
      apellido: { type: String, trim: true, maxlength: 50 }
    },
    activo: { type: Boolean, default: true }
  },
  { 
    collection: 'conjuntos', 
    timestamps: true, 
    versionKey: false 
  }
);

export default model('Conjunto', conjuntoSchema);