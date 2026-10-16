import { 
    dbCreateUser, 
    dbGetUsers, 
    dbUpdateUser, 
    dbUpdatePartialUser, 
    dbDeleteUser 
} from '../services/user.services.js';

// Obtener usuarios
const getUsers = async (req, res) => {
    try {
        const users = await dbGetUsers();
        res.status(200).json({ success: true, data: users });
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

// Actualizar usuario completo (PUT) - Se espera recibir un id por parámetros, ej: /api/users/:id
const actualizarUsers = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedUser = await dbUpdateUser(id, req.body);
        if (!updatedUser) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }
        res.status(200).json({ success: true, message: 'Usuario actualizado correctamente', data: updatedUser });
    } catch (error) {
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
        res.status(200).json({ success: false, message: 'Usuario eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export {
    registrarUsers,
    getUsers,
    actualizarUsers,
    actualizarParcialUsers,
    eliminarUsers
};