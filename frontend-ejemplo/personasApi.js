// Copiar a React/src/api/personasApi.js y crear en React/.env:
//   VITE_PERSONAS_API_URL=http://localhost:3001/api
const BASE = import.meta.env.VITE_PERSONAS_API_URL;

async function pedir(ruta, { method = 'GET', body } = {}) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${BASE}${ruta}`, {
    method,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Error en la API de personas');
  return data;
}

// ---- Registro / sesión (reemplaza handleRegistro y el login de Supabase en App.jsx) ----
export const registrarse = (f) => pedir('/auth/registro', { method: 'POST', body: f }); // {nombre, apellido, documento, correo, contrasena}
export async function iniciarSesion(correo, contrasena) {
  const { token, usuario } = await pedir('/auth/login', { method: 'POST', body: { correo, contrasena } });
  localStorage.setItem('token', token); // lo usan también la API de puestos y esta misma
  return usuario;                        // usuario.rol: 'administrador' | 'supervisor' | 'vigilante'
}
export const cambiarContrasena = (actual, nueva) => pedir('/auth/cambiar-contrasena', { method: 'POST', body: { actual, nueva } });

// ---- Validación de registros (ValidacionRegistros.jsx) ----
export const listarUsuarios = (q = '') => pedir(`/usuarios${q}`);                       // ej: '?estado_registro=pendiente&q=ana'
export const contarPendientes = () => pedir('/usuarios/conteo-pendientes');              // { pendientes: 3 }
export const aprobarUsuario = (id, rol) => pedir(`/usuarios/${id}/estado`, { method: 'PATCH', body: { estado_registro: 'aprobado', ...(rol ? { rol } : {}) } });
export const rechazarUsuario = (id) => pedir(`/usuarios/${id}/estado`, { method: 'PATCH', body: { estado_registro: 'rechazado' } });

// ---- Control de accesos (ControlAccesos.jsx): antes tabla 'accesos' de Supabase ----
export const listarVisitantes = (q = '') => pedir(`/visitantes${q}`);                    // el vigilante solo recibe los suyos
export const registrarVisitante = ({ nombre, destino, placa }) => pedir('/visitantes', { method: 'POST', body: { nombre, destino, placa } });
export const editarVisitante = (id, datos) => pedir(`/visitantes/${id}`, { method: 'PATCH', body: datos });
export const registrarSalida = (id) => pedir(`/visitantes/${id}/salida`, { method: 'PATCH' });
