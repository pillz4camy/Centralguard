import UserModel from '../model/user.model.js';

// Servicio para crear un usuario
const dbCreateUser = async (userData) => {
    try {
        const newUser = new UserModel(userData);
        return await newUser.save();
    } catch (error) {
        throw new Error(`Error al crear usuario en BD: ${error.message}`);
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

// Servicio para actualizar todas las propiedades de un usuario (PUT)
const dbUpdateUser = async (id, updateData) => {
    try {
        return await UserModel.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    } catch (error) {
        throw new Error(`Error al actualizar usuario en BD: ${error.message}`);
    }
};

// Servicio para actualizar parcialmente un usuario (PATCH)
const dbUpdatePartialUser = async (id, updateData) => {
    try {
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
    dbGetUsers,
    dbUpdateUser,
    dbUpdatePartialUser,
    dbDeleteUser
};