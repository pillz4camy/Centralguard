import mongoose from 'mongoose';

const URL_LOCAL = 'mongodb://localhost:27017/'; 
const URL_REMOTE = 'mongodb+srv://paupau:123123123@cluster0.p2blvfs.mongodb.net/';

const conexion = async () => {
    try {
        await mongoose.connect(URL_REMOTE);
        console.log("Conectado a la base de datos MongoDB");
    } catch (error) {
        console.error("Error al conectar a la base de datos Mongo");
    }
};

export default conexion;