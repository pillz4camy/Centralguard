import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const conexion = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Conectado a la base de datos de MongoDB");
    } catch (error) {
        console.error("Error al conectar a MongoDB:", error.message);
        process.exit(1);
    }
}; 

export default conexion;