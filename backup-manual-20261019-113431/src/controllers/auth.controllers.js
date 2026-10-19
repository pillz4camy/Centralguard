import { registrar, login, cambiarContrasena } from '../services/auth.services.js';

export const registro = async (req, res) =>
  res.status(201).json({ message: 'Registro enviado. Debes ser aprobado por un administrador para iniciar sesión.', usuario: await registrar(req.body) });

export const iniciarSesion = async (req, res) => res.status(200).json(await login(req.body));

export const cambiarClave = async (req, res) => res.status(200).json(await cambiarContrasena(req.user.idusuario, req.body));
