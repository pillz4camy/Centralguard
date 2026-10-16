import mongoose from "mongoose";

// Estructura actualizada según tu nuevo diagrama relacional
const UserSchema = new mongoose.Schema({
    correo: {
        type: String,
        required: true,
        unique: true,
        trim: true 
    },
    contrasenia: {
        type: String,
        required: true,
        trim: true 
    },
    nombre: {
        type: String,
        required: true,
        trim: true 
    },
    apellido: {
        type: String,
        required: true,
        trim: true 
    }
}, {
    timestamps: { 
        createdAt: 'fecha_creacion', 
        updatedAt: false 
    },
    versionKey: false 
});

const UserModel = mongoose.model('User', UserSchema);

export default UserModel;