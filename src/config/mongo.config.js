import mongoose from 'mongoose';

const conexion = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('Falta MONGODB_URI en el .env');
  await mongoose.connect(uri);
  console.log('Conectado a la base de datos MongoDB');
};

export default conexion;
