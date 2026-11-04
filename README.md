# API de Turnos - CentralGuard

Express + Mongoose + JWT + CORS + Swagger. El supervisor programa turnos y cada vigilante consulta los suyos.

## Puesta en marcha
```bash
npm install
cp .env.example .env     # pon tu MONGODB_URI y JWT_SECRET
npm run seed             # crea admin, supervisor y vigilante de prueba (clave 123456)
npm run dev
```
Swagger: http://localhost:3001/api/docs

> Si usas el mismo `MONGODB_URI` y `JWT_SECRET` que la API de rondas, los usuarios son los mismos en las dos APIs.

## Endpoints
| Método | Ruta | Acceso | Códigos |
|---|---|---|---|
| POST | /api/auth/register | Público (crea vigilante) | 201, 400, 409, 500 |
| POST | /api/auth/login | Público | 200, 400, 401, 500 |
| GET | /api/usuarios?idroles=3 | Supervisor / admin | 200, 401, 403, 500 |
| GET | /api/turnos | Token (vigilante: solo los suyos) | 200, 400, 401, 500 |
| GET | /api/turnos/:id | Token (vigilante: solo los suyos) | 200, 400, 401, 403, 404, 500 |
| POST | /api/turnos | Supervisor / admin | 201, 400, 401, 403, 409, 500 |
| PUT | /api/turnos/:id | Supervisor / admin | 200, 400, 401, 403, 404, 409, 500 |
| DELETE | /api/turnos/:id | Supervisor / admin | 200, 401, 403, 404, 500 |

## Reglas
- `fecha` en formato `YYYY-MM-DD` y horas en `HH:mm` (24 h).
- Si `hora_fin` es menor que `hora_inicio`, el turno cruza la medianoche.
- Un vigilante no puede tener dos turnos que se crucen el mismo día (409).
- Solo se puede asignar un turno a un usuario con rol vigilante.

## Flujo de prueba en Swagger
1. `POST /api/auth/login` con `supervisor@centralguard.com` / `123456`, copia el token y pulsa **Authorize**.
2. `GET /api/usuarios?idroles=3` y copia el `_id` del vigilante.
3. `POST /api/turnos` con ese `idusuario`, una fecha, horas y un puesto. Debe dar 201.
4. Repite el POST con el mismo horario: debe dar 409.
5. Cambia de usuario: login con `vigilante@centralguard.com`, **Authorize** de nuevo y `GET /api/turnos`: solo ve el suyo. Si intenta `POST /api/turnos` da 403.
