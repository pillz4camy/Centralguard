# API de Registro de Vehículos - CentralGuard

Express + Mongoose + JWT + CORS + Swagger. Control de ingreso y salida de vehículos en la portería.

## Puesta en marcha
```bash
npm install
cp .env.example .env     # pon tu MONGODB_URI y JWT_SECRET
npm run seed             # crea admin, supervisor y vigilante de prueba (clave 123456)
npm run dev
```
Swagger: http://localhost:3002/api/docs

> Con el mismo `MONGODB_URI` y `JWT_SECRET` que las otras APIs, los usuarios son los mismos en todas.

## Endpoints
| Método | Ruta | Acceso | Códigos |
|---|---|---|---|
| POST | /api/auth/register | Público (crea vigilante) | 201, 400, 409, 500 |
| POST | /api/auth/login | Público | 200, 400, 401, 500 |
| GET | /api/vehiculos | Cualquier usuario con token | 200, 400, 401, 500 |
| GET | /api/vehiculos/:id | Cualquier usuario con token | 200, 400, 401, 404, 500 |
| POST | /api/vehiculos | Cualquier usuario con token (registra ingreso) | 201, 400, 401, 409, 500 |
| PATCH | /api/vehiculos/:id/salida | Cualquier usuario con token | 200, 400, 401, 404, 409, 500 |
| PUT | /api/vehiculos/:id | Dueño del registro, supervisor o admin | 200, 400, 401, 403, 404, 409, 500 |
| DELETE | /api/vehiculos/:id | Supervisor o admin | 200, 401, 403, 404, 500 |

## Reglas
- La placa se normaliza: `abc-123` queda como `ABC123`. Se aceptan formatos de carro (ABC123) y moto (ABC12D).
- Un vehículo no puede estar "dentro" dos veces a la vez (409). Debe registrarse su salida antes de un nuevo ingreso.
- Cada ingreso es un registro nuevo, así queda el historial completo de entradas y salidas.
- Todos los vigilantes ven todos los registros y pueden registrar la salida, porque el turno de la noche debe poder dar salida a lo que entró en el día.

## Flujo de prueba en Swagger
1. `POST /api/auth/login` con `vigilante@centralguard.com` / `123456`, copia el token y pulsa **Authorize**.
2. `POST /api/vehiculos` con placa `ABC-123`, propietario y destino. Debe dar 201 y la placa queda `ABC123`.
3. Repite el mismo POST: debe dar 409 porque ya está dentro.
4. `PATCH /api/vehiculos/{id}/salida` con el `_id` del paso 2: 200, estado `salio`. Repítelo y da 409.
5. `GET /api/vehiculos?estado=dentro&placa=ABC` para filtrar.
6. `DELETE` con el vigilante da 403; con el supervisor da 200.
