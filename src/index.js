import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import conexion from './config/mongo.config.js';
import { HttpError, notFound, errorHandler } from './middleware/errors.js';

import objetoRouter from './routers/objeto.routers.js';
import personaAccesoRouter from './routers/persona_acceso.routers.js';
import puestoRouter from './routers/puesto.routers.js';
import turnoRouter from './routers/turno.routers.js';
import rondaRouter from './routers/ronda.routers.js';
import vehiculoRouter from './routers/vehiculo.routers.js';
import novedadRouter from './routers/novedad.routers.js';
import userRouter from './routers/user.routers.js'; 
import pedidoRouter from './routers/pedido.routers.js';

if (!process.env.JWT_SECRET) { 
  console.error('Falta JWT_SECRET en el .env'); 
  process.exit(1); 
}

const app = express();
const origins = (process.env.CORS_ORIGINS || 'http://localhost:5173').split(',').map((s) => s.trim());

app.use(cors({
  origin: (origin, cb) => (!origin || origins.includes(origin) ? cb(null, true) : cb(new HttpError(403, 'Origen no permitido'))),
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '100kb' }));


app.use('/api/objetos-perdidos', objetoRouter);
app.use('/api/personas-acceso', personaAccesoRouter);
app.use('/api/puestos', puestoRouter);
app.use('/api/turnos', turnoRouter);
app.use('/api/rondas', rondaRouter);
app.use('/api/novedades', novedadRouter);
app.use('/api/vehiculos', vehiculoRouter);
app.use('/api/users', userRouter); 
app.use('/api/pedidos', pedidoRouter);

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 3002;
conexion()
  .then(() => app.listen(port, () => console.log(`Servidor corriendo en http://localhost:${port}`)))
  .catch((e) => { 
    console.error('No se pudo conectar a MongoDB:', e.message); 
    process.exit(1); 
  });

export default app;