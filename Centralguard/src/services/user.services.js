import UserModel from '../model/user.model.js';
import bcrypt from 'bcrypt';

// Servicio para crear un usuario (con encriptación de contraseña)
const dbCreateUser = async (userData) => {
    try {
        const salt = await bcrypt.genSalt(10);
        userData.contrasenia = await bcrypt.hash(userData.contrasenia, salt);

        const newUser = new UserModel(userData);
        return await newUser.save();
    } catch (error) {
        throw new Error(`Error al crear usuario en BD: ${error.message}`);
    }
};

// Servicio para buscar usuario por correo (útil para el login)
const dbGetUserByEmail = async (correo) => {
    try {
        return await UserModel.findOne({ correo }).select('+contrasenia');
    } catch (error) {
        throw new Error(`Error al buscar usuario por correo: ${error.message}`);
    }
};

// Servicio para obtener todos los usuarios
const dbGetUsers = async () => {
    try {
        return await UserModel.find();
    } catch (error) {
        throw new Error(`Error al obtener usuarios de BD: ${error.message}`);
    }
};

// Servicio para obtener un usuario por ID
const dbGetUserById = async (id) => {
    try {
        return await UserModel.findById(id);
    } catch (error) {
        throw new Error(`Error al obtener el usuario de BD: ${error.message}`);
    }
};

//actualizar completo usuario
// Actualizar completo usuario (PUT estricto)
const dbUpdateUser = async (id, updateData) => {
    try {
        const user = await UserModel.findById(id).select('+contrasenia'); 
        if (!user) return null;

        if (updateData.contrasenia) {
            const salt = await bcrypt.genSalt(10);
            updateData.contrasenia = await bcrypt.hash(updateData.contrasenia, salt);
            user.contrasenia = updateData.contrasenia;
        }

        user.correo = updateData.correo;
        user.nombre = updateData.nombre;       
        user.apellido = updateData.apellido;   

    } catch (error) {
        throw new Error(`Error al actualizar usuario en BD: ${error.message}`);
    }
};

// Servicio para actualizar parcialmente un usuario 
const dbUpdatePartialUser = async (id, updateData) => {
    try {
        if (updateData.contrasenia) {
            const salt = await bcrypt.genSalt(10);
            updateData.contrasenia = await bcrypt.hash(updateData.contrasenia, salt);
        }
        return await UserModel.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    } catch (error) {
        throw new Error(`Error al actualizar parcialmente el usuario: ${error.message}`);
    }
};

// Servicio para eliminar un usuario
const dbDeleteUser = async (id) => {
    try {
        return await UserModel.findByIdAndDelete(id);
    } catch (error) {
        throw new Error(`Error al eliminar usuario de BD: ${error.message}`);
    }
};

export {
    dbCreateUser,
    dbGetUserByEmail,
    dbGetUsers,
    dbGetUserById,
    dbUpdateUser,
    dbUpdatePartialUser,
    dbDeleteUser
};