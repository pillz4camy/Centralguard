import { Schema, model } from 'mongoose';

const roleSchema = new Schema(
  {
    nombre_rol: { 
      type: String, 
      required: true, 
      unique: true, 
      trim: true,
      enum: ['administrador', 'vigilante'] 
    }
  },
  { collection: 'roles', versionKey: false }
);

export default model('Role', roleSchema);