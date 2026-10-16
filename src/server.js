require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const openapi = require('./swagger');
const { connectDB } = require('./db');
const { HttpError, notFound, errorHandler } = require('./middleware/errors');

if (!process.env.JWT_SECRET) { console.error('Falta JWT_SECRET en el .env'); process.exit(1); }

const app = express();
const origins = (process.env.CORS_ORIGINS || 'http://localhost:5173').split(',').map((s) => s.trim());

app.use(cors({
  origin: (origin, cb) => (!origin || origins.includes(origin) ? cb(null, true) : cb(new HttpError(403, 'Origen no permitido por CORS'))),
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

app.get('/', (req, res) => res.status(200).json({ message: 'API de Equipos activa', docs: '/api-docs' }));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapi));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/equipos', require('./routes/equipos'));
app.use('/api', require('./routes/asignaciones'));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
connectDB()
  .then(() => app.listen(PORT, () => console.log(`API en http://localhost:${PORT}  |  Swagger en http://localhost:${PORT}/api-docs`)))
  .catch((e) => { console.error('No se pudo conectar a MongoDB:', e.message); process.exit(1); });
