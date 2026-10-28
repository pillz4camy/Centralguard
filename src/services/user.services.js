import UserModel from '../model/user.model.js';
import bcrypt from 'bcrypt';

const dbCreateUser = async (userData) => {
    const salt = await bcrypt.genSalt(10);
    userData.contrasenia = await bcrypt.hash(userData.contrasenia, salt);
    const newUser = new UserModel(userData);
    return await newUser.save();
};

const dbGetUserByEmail = async (correo) => {
    return await UserModel.findOne({ correo }).select('+contrasenia');
};

const dbGetUsers = async () => {
    return await UserModel.find().populate('idroles', 'nombre_rol');
};

const dbGetUserById = async (id) => {
    return await UserModel.findById(id).populate('idroles', 'nombre_rol');
};

const dbUpdateUser = async (id, updateData) => {
    if (updateData.contrasenia) {
        const salt = await bcrypt.genSalt(10);
        updateData.contrasenia = await bcrypt.hash(updateData.contrasenia, salt);
    }
    return await UserModel.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
};

const dbDeleteUser = async (id) => {
    return await UserModel.findByIdAndDelete(id);
};

export {
    dbCreateUser,
    dbGetUserByEmail,
    dbGetUsers,
    dbGetUserById,
    dbUpdateUser,
    dbDeleteUser
};