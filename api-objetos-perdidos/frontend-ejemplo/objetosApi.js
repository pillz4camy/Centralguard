// Copiar a React/src/api/objetosApi.js y crear en React/.env:
//   VITE_OBJETOS_API_URL=http://localhost:3002/api/objetos-perdidos
// El token es el que guarda iniciarSesion() de personasApi.js (api-personas).
const BASE = import.meta.env.VITE_OBJETOS_API_URL;

async function pedir(ruta = '', { method = 'GET', body } = {}) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${BASE}${ruta}`, {
    method,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Error en la API de objetos perdidos');
  return data;
}

// ObjetosPerdidos.jsx (vigilante): la API ya devuelve solo los suyos, sin .eq('idusuario', ...)
export const listarObjetos = (q = '') => pedir(q);       // ej: '?estado=en_custodia&q=llaves&desde=2026-10-01'
export const resumenObjetos = () => pedir('/resumen');   // { en_custodia, entregados, total }
export const registrarObjeto = ({ articulo, ubicacion_hallazgo, estado, entregado_a }) =>
  pedir('', { method: 'POST', body: { articulo, ubicacion_hallazgo, estado, entregado_a } });
export const editarObjeto = (id, datos) => pedir(`/${id}`, { method: 'PATCH', body: datos });
export const entregarObjeto = (id, entregado_a) => pedir(`/${id}/entregar`, { method: 'PATCH', body: { entregado_a } });

// SupervisorObjetosPerdidos.jsx
export const eliminarObjeto = (id) => pedir(`/${id}`, { method: 'DELETE' });
// Para filtrar por vigilante: listarObjetos(`?idusuario=${id}`)
