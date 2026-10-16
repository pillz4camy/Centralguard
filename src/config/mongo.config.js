import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); // Carga las variables del archivo .env

const conexion = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Conectado a la base de datos MongoDB");
    } catch (error) {
        console.error("Error al conectar a la base de datos Mongo:", error);
    }
}; 

export default conexion;