// Copia este archivo en tu front: src/api/api.js
const API = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export const getToken = () => localStorage.getItem('token')
export const guardarSesion = (token, usuario) => {
  localStorage.setItem('token', token)
  localStorage.setItem('usuario', JSON.stringify(usuario))
}
export const cerrarSesion = () => { localStorage.removeItem('token'); localStorage.removeItem('usuario') }

export async function api(ruta, { method = 'GET', body } = {}) {
  const res = await fetch(`${API}${ruta}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(getToken() && { Authorization: `Bearer ${getToken()}` }),
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const data = await res.json().catch(() => ({}))
  if (res.status === 401) cerrarSesion() // token vencido: obliga a iniciar sesión otra vez
  if (!res.ok) throw new Error(data.message || 'Error en la API')
  return data
}

export const login = async (correo, contrasena) => {
  const data = await api('/auth/login', { method: 'POST', body: { correo, contrasena } })
  guardarSesion(data.token, data.usuario)
  return data.usuario
}
