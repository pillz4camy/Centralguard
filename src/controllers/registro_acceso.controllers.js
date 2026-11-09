import * as service from '../services/registro_acceso.services.js';

export const getRegistros = async (req, res) => res.status(200).json(await service.listarRegistrosAcceso(req.query));

export const getRegistro = async (req, res) => res.status(200).json(await service.obtenerRegistroAcceso(req.params.id));

export const crearRegistro = async (req, res) => res.status(201).json(await service.crearRegistroAcceso(req.body));

export const registrarSalida = async (req, res) => res.status(200).json(await service.registrarSalida(req.params.id, req.body));

export const actualizarRegistro = async (req, res) => res.status(200).json(await service.actualizarRegistroAcceso(req.params.id, req.body));

export const eliminarRegistro = async (req, res) => {
  const reg = await service.eliminarRegistroAcceso(req.params.id);
  res.status(200).json({ message: 'Registro de acceso eliminado correctamente', registro: reg });
};
