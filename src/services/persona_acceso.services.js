import mongoose from 'mongoose';
import PersonaAcceso, { TIPOS_PERSONA } from '../model/persona_acceso.model.js';
import { HttpError } from '../middleware/errors.js';

const validarId = (id) => {
  if (!mongoose.isValidObjectId(id)) throw new HttpError(400, 'El id no es válido');
  return String(id);
};

export const listar = async (query = {}) => {
  const filtro = {};
  if (query.tipo_persona || query.tipo) {
    const t = query.tipo_persona || query.tipo;
    if (!TIPOS_PERSONA.includes(t)) throw new HttpError(400, 'tipo_persona inválido');
    filtro.tipo_persona = t;
  }
  if (query.documento) {
    filtro['documento.numero'] = String(query.documento).trim();
  }
  if (query.nombre) {
    filtro.primer_nombre = new RegExp(String(query.nombre).trim(), 'i');
  }

  return PersonaAcceso.find(filtro).sort({ createdAt: -1 });
};

export const obtener = async (id) => {
  const p = await PersonaAcceso.findById(validarId(id));
  if (!p) throw new HttpError(404, 'Persona de acceso no encontrada');
  return p;
};

export const crear = async (body) => {
  const { primer_nombre, primer_apellido, nombre, apellido, documento, tipo_persona, tipo, empresa_procedencia } = body || {};

  const pNombre = primer_nombre || nombre;
  const pApellido = primer_apellido || apellido;

  if (!pNombre || !pApellido || !documento) {
    throw new HttpError(400, 'primer_nombre, primer_apellido y documento son obligatorios');
  }

  const docNumero = typeof documento === 'object' ? documento.numero : documento;
  const docTipo = typeof documento === 'object' ? (documento.tipo || 'CC') : 'CC';

  if (!docNumero) throw new HttpError(400, 'El número de documento es obligatorio');

  const tipoFinal = tipo_persona || tipo || 'visitante';
  if (!TIPOS_PERSONA.includes(tipoFinal)) {
    throw new HttpError(400, `tipo_persona inválido. Opciones: ${TIPOS_PERSONA.join(', ')}`);
  }

  return PersonaAcceso.create({
    primer_nombre: String(pNombre).trim(),
    primer_apellido: String(pApellido).trim(),
    documento: {
      tipo: docTipo,
      numero: String(docNumero).trim()
    },
    tipo_persona: tipoFinal,
    empresa_procedencia: empresa_procedencia ? String(empresa_procedencia).trim() : null
  });
};

export const actualizar = async (id, body) => {
  validarId(id);
  const datos = {};
  if (body.primer_nombre || body.nombre) datos.primer_nombre = String(body.primer_nombre || body.nombre).trim();
  if (body.primer_apellido || body.apellido) datos.primer_apellido = String(body.primer_apellido || body.apellido).trim();
  if (body.documento) {
    const docNumero = typeof body.documento === 'object' ? body.documento.numero : body.documento;
    const docTipo = typeof body.documento === 'object' ? (body.documento.tipo || 'CC') : 'CC';
    datos.documento = { tipo: docTipo, numero: String(docNumero).trim() };
  }
  if (body.tipo_persona || body.tipo) {
    const t = body.tipo_persona || body.tipo;
    if (!TIPOS_PERSONA.includes(t)) throw new HttpError(400, 'tipo_persona inválido');
    datos.tipo_persona = t;
  }
  if (body.empresa_procedencia !== undefined) {
    datos.empresa_procedencia = body.empresa_procedencia ? String(body.empresa_procedencia).trim() : null;
  }

  const p = await PersonaAcceso.findByIdAndUpdate(id, datos, { new: true, runValidators: true });
  if (!p) throw new HttpError(404, 'Persona de acceso no encontrada');
  return p;
};

export const eliminar = async (id) => {
  const p = await PersonaAcceso.findByIdAndDelete(validarId(id));
  if (!p) throw new HttpError(404, 'Persona de acceso no encontrada');
  return p;
};
