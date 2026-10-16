const router = require('express').Router();
const Asignacion = require('../models/AsignacionEquipo');
const Usuario = require('../models/Usuario');
const Equipo = require('../models/Equipo');
const { HttpError, wrap } = require('../middleware/errors');
const { requireAuth, requireAdmin, esAdmin } = require('../middleware/auth');

router.use(requireAuth);

const parseId = (v, nombre = 'id') => {
  if (!/^[0-9a-fA-F]{24}$/.test(String(v))) throw new HttpError(400, `${nombre} no es válido`);
  return String(v);
};

const POPULATE = { path: 'idequipos', select: 'nombre_activo serial_unico estado' };

// Deja la respuesta como la usa el front: { _id, idusuario, equipo: {...}, fecha_entrega, ... }
const formatear = (a) => {
  const o = a.toObject ? a.toObject() : a;
  const { idequipos, ...resto } = o;
  return { ...resto, idequipos: idequipos?._id ?? idequipos, equipo: idequipos?._id ? idequipos : null };
};

// Equipos de un usuario (cada usuario ve los suyos; el admin ve los de cualquiera)
router.get('/usuarios/:id/equipos', wrap(async (req, res) => {
  const id = parseId(req.params.id);
  if (id !== String(req.user.idusuario) && !esAdmin(req.user)) {
    throw new HttpError(403, 'Solo puedes ver tus propios equipos');
  }
  const data = await Asignacion.find({ idusuario: id }).sort({ fecha_entrega: -1 }).populate(POPULATE);
  res.status(200).json(data.map(formatear));
}));

// Asignar un equipo a un usuario
router.post('/asignaciones', requireAdmin, wrap(async (req, res) => {
  const { idusuario, idequipos, observaciones_entrega } = req.body || {};
  if (!idusuario || !idequipos) throw new HttpError(400, 'idusuario e idequipos son obligatorios');
  parseId(idusuario, 'idusuario'); parseId(idequipos, 'idequipos');

  if (!(await Usuario.exists({ _id: idusuario }))) throw new HttpError(400, 'El usuario no existe');
  if (!(await Equipo.exists({ _id: idequipos }))) throw new HttpError(400, 'El equipo no existe');
  if (await Asignacion.exists({ idequipos, fecha_devolucion: null })) {
    throw new HttpError(400, 'Ese equipo ya está asignado y no ha sido devuelto');
  }

  const creada = await Asignacion.create({
    idusuario, idequipos,
    observaciones_entrega: typeof observaciones_entrega === 'string' ? observaciones_entrega : undefined,
  });
  res.status(201).json(formatear(await creada.populate(POPULATE)));
}));

// Registrar la devolución
router.put('/asignaciones/:id/devolver', requireAdmin, wrap(async (req, res) => {
  const a = await Asignacion.findById(parseId(req.params.id));
  if (!a) throw new HttpError(404, 'Asignación no encontrada');
  if (a.fecha_devolucion) throw new HttpError(400, 'Esta asignación ya fue devuelta');
  a.fecha_devolucion = new Date();
  await a.save();
  res.status(200).json(formatear(await a.populate(POPULATE)));
}));

module.exports = router;
