import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const conexion = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Conectado a la base de datos de mongoDB");
    } catch (error) {
        console.error("Error al conectar a mongoDB:", error.message);
        process.exit(1);
    }
}; 

export default conexion;