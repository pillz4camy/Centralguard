# API de Rondas - CentralGuard

Express + Mongoose + JWT + CORS + Swagger.

## Puesta en marcha
```bash
npm install
cp .env.example .env     # ajusta MONGODB_URI y JWT_SECRET
npm run seed             # (opcional) crea admin y supervisor de prueba
npm run dev
```
Documentación Swagger: http://localhost:3000/api/docs

## Endpoints
| Método | Ruta | Acceso | Códigos |
|---|---|---|---|
| POST | /api/auth/register | Público (crea vigilante) | 201, 400, 409, 500 |
| POST | /api/auth/login | Público | 200, 400, 401, 500 |
| GET | /api/rondas | Token (vigilante: solo las suyas) | 200, 400, 401, 500 |
| GET | /api/rondas/:id | Token | 200, 400, 401, 403, 404, 500 |
| POST | /api/rondas | Token | 201, 400, 401, 500 |
| PUT | /api/rondas/:id | Token (dueño, supervisor o admin) | 200, 400, 401, 403, 404, 500 |
| DELETE | /api/rondas/:id | Supervisor o admin | 200, 401, 403, 404, 500 |

## Prueba rápida con curl
```bash
curl -X POST localhost:3000/api/auth/register -H "Content-Type: application/json" \
  -d '{"usuario":"carlos@correo.com","contrasena":"123456","nombre":"Carlos"}'

TOKEN=$(curl -s -X POST localhost:3000/api/auth/login -H "Content-Type: application/json" \
  -d '{"usuario":"carlos@correo.com","contrasena":"123456"}' | node -pe "JSON.parse(require('fs').readFileSync(0)).token")

curl -X POST localhost:3000/api/rondas -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"sector":"Torre 2 - Parqueaderos","observaciones":"Sin novedades"}'

curl localhost:3000/api/rondas -H "Authorization: Bearer $TOKEN"
```
