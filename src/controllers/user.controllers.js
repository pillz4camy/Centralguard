import { 
    dbCreateUser, 
    dbGetUserByEmail,
    dbGetUsers, 
    dbGetUserById, 
    dbUpdateUser, 
    dbDeleteUser 
} from '../services/user.services.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

const getUsers = async (req, res) => {
    try {
        const users = await dbGetUsers();
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'ID no válido' });
        }
        const user = await dbGetUserById(id);
        if (!user) return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const registrarUsers = async (req, res) => {
    try {
        const newUser = await dbCreateUser(req.body);
        res.status(201).json({ success: true, message: 'Usuario registrado con éxito', data: newUser });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const actualizarUsers = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'ID inválido' });
        }
        const updatedUser = await dbUpdateUser(id, req.body);
        if (!updatedUser) return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        res.status(200).json({ success: true, message: 'Usuario actualizado correctamente', data: updatedUser });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const eliminarUsers = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'ID inválido' });
        }
        const deletedUser = await dbDeleteUser(id);
        if (!deletedUser) return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        res.status(200).json({ success: true, message: 'Usuario eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const { correo, contrasenia } = req.body;
        if (!correo || !contrasenia) {
            return res.status(400).json({ success: false, message: 'Correo y contraseña son obligatorios' });
        }
        const user = await dbGetUserByEmail(correo);
        if (!user || !(await bcrypt.compare(contrasenia, user.contrasenia))) {
            return res.status(401).json({ success: false, message: 'Correo o contraseña incorrectos' });
        }
        const secretKey = process.env.JWT_SECRET || 'clave_secreta_centralguard_2026';
        const token = jwt.sign({ id: user._id, correo: user.correo }, secretKey, { expiresIn: '24h' });

        res.status(200).json({
            success: true,
            message: 'Inicio de sesión exitoso',
            token,
            user: { id: user._id, nombre: user.nombre, correo: user.correo }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export { registrarUsers, getUsers, getUserById, actualizarUsers, eliminarUsers, loginUser };