# API de Equipos (Node + Express + MongoDB/Mongoose)

## Pasos
1. Node.js 18+ y MongoDB (local o Atlas). En esta carpeta: `npm install`
2. Copia `.env.example` a `.env` y completa `MONGODB_URI` y `JWT_SECRET`.
3. `npm run seed` crea los roles (Administrador / Usuario), un admin y 2 equipos de prueba.
4. `npm run dev` -> API en http://localhost:3000 y Swagger en http://localhost:3000/api-docs
5. En Swagger: `POST /api/auth/login` con el admin, copia el token, pulsa **Authorize** y prueba los endpoints.
6. Front: copia `frontend-ejemplo/api.js` a `src/api/api.js` y crea `.env` con `VITE_API_URL=http://localhost:3000/api`.
   Reemplaza cada `supabase.from(...)` por `api(...)` (ver `MisEquipos.jsx`).

## Endpoints
| Método | Ruta | Acceso |
|---|---|---|
| POST | /api/auth/login, /api/auth/register | público |
| GET | /api/equipos, /api/equipos/:id | autenticado |
| POST/PUT/DELETE | /api/equipos(/:id) | admin |
| GET | /api/usuarios/:id/equipos | dueño o admin |
| POST | /api/asignaciones | admin |
| PUT | /api/asignaciones/:id/devolver | admin |

## Códigos HTTP
200 OK · 201 creado · 400 datos inválidos · 401 sin token/credenciales malas · 403 sin permiso · 404 no existe · 500 error interno

## Control de versiones (evidencia)
```
git init && git add . && git commit -m "feat: API base con Express y Mongoose"
git checkout -b feature/autenticacion-jwt
git checkout -b feature/equipos-crud
git checkout -b feature/asignaciones
```
Haz commits pequeños por funcionalidad y fusiona con `git merge` a `main`; luego toma capturas de `git log --oneline --graph --all` y del repo en GitHub.
