const router = require('express').Router();
const Equipo = require('../models/Equipo');
const Asignacion = require('../models/AsignacionEquipo');
const { HttpError, wrap } = require('../middleware/errors');
const { requireAuth, requireAdmin } = require('../middleware/auth');

router.use(requireAuth);

const parseId = (v) => {
  if (!/^[0-9a-fA-F]{24}$/.test(String(v))) throw new HttpError(400, 'El id no es válido');
  return String(v);
};

const validar = (b, parcial = false) => {
  const out = {};
  for (const c of ['nombre_activo', 'serial_unico', 'estado']) {
    if (b[c] !== undefined) {
      if (typeof b[c] !== 'string' || !b[c].trim()) throw new HttpError(400, `${c} debe ser un texto no vacío`);
      out[c] = b[c].trim();
    } else if (!parcial) throw new HttpError(400, `${c} es obligatorio`);
  }
  if (parcial && !Object.keys(out).length) throw new HttpError(400, 'No enviaste ningún campo para actualizar');
  return out;
};

router.get('/', wrap(async (req, res) => {
  const filtro = {};
  if (req.query.estado) {
    if (typeof req.query.estado !== 'string') throw new HttpError(400, 'estado debe ser texto');
    filtro.estado = req.query.estado;
  }
  res.status(200).json(await Equipo.find(filtro).sort({ _id: 1 }));
}));

router.get('/:id', wrap(async (req, res) => {
  const data = await Equipo.findById(parseId(req.params.id));
  if (!data) throw new HttpError(404, 'Equipo no encontrado');
  res.status(200).json(data);
}));

router.post('/', requireAdmin, wrap(async (req, res) => {
  res.status(201).json(await Equipo.create(validar(req.body || {})));
}));

router.put('/:id', requireAdmin, wrap(async (req, res) => {
  const data = await Equipo.findByIdAndUpdate(parseId(req.params.id), validar(req.body || {}, true), { new: true, runValidators: true });
  if (!data) throw new HttpError(404, 'Equipo no encontrado');
  res.status(200).json(data);
}));

router.delete('/:id', requireAdmin, wrap(async (req, res) => {
  const id = parseId(req.params.id);
  if (await Asignacion.exists({ idequipos: id })) {
    throw new HttpError(400, 'No se puede eliminar: el equipo tiene asignaciones registradas');
  }
  const data = await Equipo.findByIdAndDelete(id);
  if (!data) throw new HttpError(404, 'Equipo no encontrado');
  res.status(200).json({ message: 'Equipo eliminado', equipo: data });
}));

module.exports = router;
