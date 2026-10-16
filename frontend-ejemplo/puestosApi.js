// Copiar a React/src/api/puestosApi.js y crear en React/.env:
//   VITE_PUESTOS_API_URL=http://localhost:3000/api/puestos
const BASE = import.meta.env.VITE_PUESTOS_API_URL;

async function pedir(ruta = '', { method = 'GET', body } = {}) {
  const token = localStorage.getItem('token'); // el que devuelve la API de usuarios al hacer login
  const res = await fetch(`${BASE}${ruta}`, {
    method,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Error en la API de puestos');
  return data;
}

export const listarPuestos = (filtros = '') => pedir(filtros);          // ej: '?activo=true'
export const crearPuesto = (p) => pedir('', { method: 'POST', body: p });
export const actualizarPuesto = (id, p) => pedir(`/${id}`, { method: 'PATCH', body: p });
export const eliminarPuesto = (id) => pedir(`/${id}`, { method: 'DELETE' });
