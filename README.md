# API de Personas (CentralGuard)

Cubre **todo lo relacionado con registros de personas**:
- **Usuarios del sistema**: registro público, aprobación/rechazo por el administrador, login (JWT) y cambio de contraseña.
- **Visitantes**: el control de accesos de portería (nombre, destino/apto, placa, ingreso y salida).

Node + Express 5 + Mongoose 9, misma estructura que `api-puestos` (config / models / services / controllers / routers).

## Pasos
1. `npm install`
2. Copia `.env.example` a `.env` y completa `MONGODB_URI`, `JWT_SECRET` y los datos del admin inicial.
3. `npm run seed` crea el administrador inicial (ya aprobado) y los índices únicos.
4. `npm run dev` -> http://localhost:3001

> **Esta API firma los tokens.** `api-puestos` debe usar el **mismo `JWT_SECRET`** para aceptarlos.

## Endpoints
### Auth (`/api/auth`)
| Método | Ruta | Acceso |
|---|---|---|
| POST | /registro `{nombre, apellido, documento, correo, contrasena, telefono?}` | público (5 registros/hora por IP) |
| POST | /login `{correo, contrasena}` -> `{token, usuario}` | público (10 intentos fallidos/15 min) |
| POST | /cambiar-contrasena `{actual, nueva}` | cualquier usuario autenticado |

El registro **siempre** crea un `vigilante` en estado `pendiente`; `rol` y `estado_registro` del body se ignoran.
Un usuario `pendiente` o `rechazado` no puede iniciar sesión (403).

### Usuarios (`/api/usuarios`) — requiere token
| Método | Ruta | Acceso |
|---|---|---|
| GET | / (`?estado_registro=pendiente&rol=&q=&page=&limit=`) | administrador, supervisor |
| GET | /conteo-pendientes -> `{pendientes}` | administrador |
| GET | /:id | administrador, supervisor |
| PATCH | /:id/estado `{estado_registro, rol?}` (aprobar/rechazar) | administrador |
| PATCH | /:id (editar datos, rol, estado) | administrador |
| DELETE | /:id | administrador |

Un administrador no puede rechazarse, cambiarse el rol ni eliminarse a sí mismo.

### Visitantes (`/api/visitantes`) — requiere token
| Método | Ruta | Acceso |
|---|---|---|
| POST | / `{nombre, destino, placa?, documento?, observaciones?}` | todos (el `idusuario` sale del token) |
| GET | / (`?q=&placa=&en_sitio=true&desde=2026-10-01&hasta=&idusuario=&page=&limit=`) | vigilante: solo los suyos · supervisor/admin: todos |
| GET | /:id | dueño, supervisor, admin |
| PATCH | /:id | dueño, supervisor, admin |
| PATCH | /:id/salida | dueño, supervisor, admin |
| DELETE | /:id | supervisor, admin |

## Códigos
200 OK · 201 creado · 400 datos inválidos/duplicado · 401 sin token o credenciales malas · 403 sin permiso/cuenta no aprobada · 404 no existe · 429 demasiadas peticiones.
