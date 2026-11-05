# API de Roles - CentralGuard

Express + Mongoose + JWT + CORS + Swagger. Gestiona los roles del sistema y permite asignarlos a los usuarios.

## Puesta en marcha
```bash
npm install
cp .env.example .env     # pon tu MONGODB_URI y JWT_SECRET
npm run seed             # crea los roles 1, 2, 3 y un usuario de prueba por rol (clave 123456)
npm run dev
```
Swagger: http://localhost:3003/api/docs

> Con el mismo `MONGODB_URI` y `JWT_SECRET` que las otras APIs, los usuarios son los mismos en todas.

## Endpoints
| Método | Ruta | Acceso | Códigos |
|---|---|---|---|
| POST | /api/auth/register | Público (crea vigilante) | 201, 400, 409, 500 |
| POST | /api/auth/login | Público | 200, 400, 401, 500 |
| GET | /api/roles | Cualquier usuario con token | 200, 401, 500 |
| GET | /api/roles/:idroles | Cualquier usuario con token | 200, 400, 401, 404, 500 |
| GET | /api/roles/:idroles/usuarios | Supervisor o admin | 200, 400, 401, 403, 404, 500 |
| POST | /api/roles | Admin | 201, 400, 401, 403, 409, 500 |
| PUT | /api/roles/:idroles | Admin | 200, 400, 401, 403, 404, 409, 500 |
| DELETE | /api/roles/:idroles | Admin | 200, 400, 401, 403, 404, 409, 500 |
| PUT | /api/usuarios/:id/rol | Admin | 200, 400, 401, 403, 404, 409, 500 |

## Reglas
- Los roles se identifican por `idroles` (1 = Administrador, 2 = Supervisor, 3 = Vigilante), igual que en tu tabla `roles` de Supabase.
- El nombre del rol no se repite, sin importar mayúsculas ni tildes (409).
- El `idroles` no se puede cambiar una vez creado.
- Los roles base (1, 2 y 3) no se pueden eliminar, y tampoco un rol que tenga usuarios asignados (409).
- Un administrador no puede quitarse su propio rol.
- Un usuario ve su nuevo rol al volver a iniciar sesión, porque el rol viaja dentro del token.

## Flujo de prueba en Swagger
1. `POST /api/auth/login` con `admin@centralguard.com` / `123456`, copia el token y pulsa **Authorize**.
2. `GET /api/roles`: deben salir los tres roles base.
3. `POST /api/roles` con `{ "nombre_rol": "Contador" }`: 201 y recibe el idroles 4.
4. Repite el POST: 409 por nombre repetido.
5. `GET /api/roles/3/usuarios` y copia el `_id` del vigilante.
6. `PUT /api/usuarios/{id}/rol` con `{ "idroles": 4 }`: 200. Con `{ "idroles": 99 }`: 400.
7. `DELETE /api/roles/4`: 409 mientras tenga ese usuario. Devuélvele el rol 3 y repite: 200.
8. `DELETE /api/roles/1`: 409 por ser rol base.
