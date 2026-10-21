import { 
    dbCreateUser, 
    dbGetUserByEmail,
    dbGetUsers, 
    dbGetUserById, 
    dbUpdateUser, 
    dbUpdatePartialUser, 
    dbDeleteUser 
} from '../services/user.services.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

// Obtener todos los usuarios
const getUsers = async (req, res) => {
    try {
        const users = await dbGetUsers();
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Obtener un usuario por ID
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        // valida el formato de objetid de mongodb
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ 
                success: false, 
                message: 'El ID proporcionado no tiene un formato válido' 
            });
        }

        const user = await dbGetUserById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Registrar un usuario
const registrarUsers = async (req, res) => {
    try {
        const newUser = await dbCreateUser(req.body);
        res.status(201).json({ success: true, message: 'Usuario registrado con éxito', data: newUser });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Actualizar usuario completo
const actualizarUsers = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'ID inválido' });
        }

        const updatedUser = await dbUpdateUser(id, req.body);
        if (!updatedUser) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }
        res.status(200).json({ success: true, message: 'Usuario actualizado correctamente', data: updatedUser });
    } catch (error) {
        // 👈 Si Mongoose falla por validación, devolvemos 400 (Bad Request)
        res.status(400).json({ success: false, message: error.message });
    }
};

// Actualizar usuario parcialmente (PATCH)
const actualizarParcialUsers = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedUser = await dbUpdatePartialUser(id, req.body);
        if (!updatedUser) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }
        res.status(200).json({ success: true, message: 'Usuario actualizado parcialmente', data: updatedUser });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Eliminar usuario
const eliminarUsers = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await dbDeleteUser(id);
        if (!deletedUser) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }
        res.status(200).json({ success: true, message: 'Usuario eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Función de Login con JWT
const loginUser = async (req, res) => {
    try {
        const { correo, contrasenia } = req.body;

        if (!correo || !contrasenia) {
            return res.status(400).json({ success: false, message: 'Correo y contraseña son obligatorios' });
        }

        const user = await dbGetUserByEmail(correo);
        if (!user) {
            return res.status(401).json({ success: false, message: 'Correo o contraseña incorrectos' });
        }

        const isPasswordValid = await bcrypt.compare(contrasenia, user.contrasenia);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: 'Correo o contraseña incorrectos' });
        }

        const secretKey = process.env.JWT_SECRET || 'clave_secreta_centralguard_2026';
        const token = jwt.sign(
            { id: user._id, correo: user.correo }, 
            secretKey, 
            { expiresIn: '24h' }
        );

        res.status(200).json({
            success: true,
            message: 'Inicio de sesión exitoso',
            token,
            user: {
                id: user._id,
                nombre: user.nombre,
                correo: user.correo
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export {
    registrarUsers,
    getUsers,
    getUserById,
    actualizarUsers,
    actualizarParcialUsers,
    eliminarUsers,
    loginUser
};