import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import conexion from './config/mongo.config.js';
import objetoRouter from './routers/objeto.routers.js';
import { generalLimiter } from './middleware/rateLimit.js';
import { HttpError, notFound, errorHandler } from './middleware/errors.js';

if (!process.env.JWT_SECRET) { console.error('Falta JWT_SECRET en el .env'); process.exit(1); }

const app = express();
const origins = (process.env.CORS_ORIGINS || 'http://localhost:5173').split(',').map((s) => s.trim());

app.use(helmet());
app.use(cors({
  origin: (origin, cb) => (!origin || origins.includes(origin) ? cb(null, true) : cb(new HttpError(403, 'Origen no permitido por CORS'))),
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '100kb' }));
app.use(generalLimiter);

app.get('/health', (req, res) => res.json({ msg: 'API de objetos perdidos de CentralGuard funcionando!' }));
app.use('/api/objetos-perdidos', objetoRouter);

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 3002;
conexion()
  .then(() => app.listen(port, () => console.log(`Servidor corriendo en http://localhost:${port}`)))
  .catch((e) => { console.error('No se pudo conectar a MongoDB:', e.message); process.exit(1); });

export default app;
