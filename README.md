# API de Puestos de Vigilancia (CentralGuard)

Node + Express 5 + Mongoose 9, con la misma estructura de `Centralguard-feature-users`
(config / models / services / controllers / routers) y autenticación JWT.

## Pasos
1. `npm install`
2. Copia `.env.example` a `.env` y completa `MONGODB_URI` y `JWT_SECRET`
   (el `JWT_SECRET` debe ser el mismo con el que la API de usuarios firma los tokens).
3. `npm run seed` carga los 8 puestos que hoy están fijos en el frontend.
4. `npm run dev` -> http://localhost:3000

## Endpoints (todos requieren `Authorization: Bearer <token>`)
| Método | Ruta | Acceso |
|---|---|---|
| GET | /api/puestos (`?activo=true`, `?tipo=Portería`) | cualquier usuario autenticado |
| GET | /api/puestos/:id | cualquier usuario autenticado |
| POST | /api/puestos | admin / supervisor |
| PUT | /api/puestos/:id (reemplazo completo) | admin / supervisor |
| PATCH | /api/puestos/:id (parcial, p. ej. `{"activo": false}`) | admin / supervisor |
| DELETE | /api/puestos/:id | admin / supervisor |

## Modelo `Puesto`
`nombre` (único, obligatorio) · `tipo` (Portería, Recepción, Parqueadero, Ronda, Torre, Zona común, Otro) ·
`ubicacion` · `descripcion` · `vigilantes_requeridos` (1–50) · `activo` · `createdAt/updatedAt`

## Notas
- El token debe traer `rol` (ej. `Administrador`, `Supervisor`, `Vigilante`). Los roles que pueden gestionar
  puestos se configuran en `ROLES_GESTION`.
- Códigos: 200 OK · 201 creado · 400 datos inválidos/duplicado · 401 sin token · 403 sin permiso · 404 no existe · 429 demasiadas peticiones.
