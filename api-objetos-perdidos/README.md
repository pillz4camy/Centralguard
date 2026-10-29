# API de Objetos Perdidos (CentralGuard)

Objetos que los vigilantes encuentran y dejan en custodia, hasta que se entregan a su dueño.
Node + Express 5 + Mongoose 9, misma estructura que `api-puestos` y `api-personas`.

## Pasos
1. `npm install`
2. Copia `.env.example` a `.env` y completa `MONGODB_URI` y `JWT_SECRET`.
   **Debe ser el mismo `JWT_SECRET` de `api-personas`**, que es quien firma los tokens.
3. `npm run dev` -> http://localhost:3002

## Endpoints (todos requieren `Authorization: Bearer <token>`)
Base: `/api/objetos-perdidos`

| Método | Ruta | Acceso |
|---|---|---|
| POST | / `{articulo, ubicacion_hallazgo?, descripcion?, estado?, entregado_a?}` | todos (el `idusuario` sale del token) |
| GET | / (`?estado=&q=&desde=&hasta=&idusuario=&page=&limit=`) | vigilante: solo los suyos · supervisor/admin: todos |
| GET | /resumen -> `{en_custodia, entregados, total}` | mismo alcance que el listado |
| GET | /:id | dueño, supervisor, admin |
| PATCH | /:id | dueño, supervisor, admin |
| PATCH | /:id/entregar `{entregado_a?}` | dueño, supervisor, admin |
| DELETE | /:id | supervisor, admin |

## Modelo
`articulo` · `descripcion` · `ubicacion_hallazgo` · `estado` (`en_custodia` | `entregado`) · `entregado_a` ·
`fecha_entrega` (automática) · `idusuario` (vigilante que lo registró) · `fecha_registro`

## Reglas
- Al pasar a `entregado` se guarda `fecha_entrega` automáticamente.
- Un objeto `en_custodia` no puede tener `entregado_a`. Si lo devuelves a custodia, se limpian `entregado_a` y `fecha_entrega`.
- `/entregar` es atómico: si dos personas lo intentan a la vez, solo una lo logra (la otra recibe 400).
- Códigos: 200 OK · 201 creado · 400 datos inválidos · 401 sin token · 403 sin permiso · 404 no existe · 429 demasiadas peticiones.
