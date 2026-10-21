import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    idroles: {
        type: mongoose.Schema.Types.ObjectId,
        required: false 
    },
    correo: {
        type: String,
        required: true,
        unique: true,
        trim: true 
    },
    contrasenia: {
        type: String,
        required: true,
        trim: true,
        select: false
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