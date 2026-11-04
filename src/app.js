import express from 'express'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import { swaggerSpec } from './config/swagger.js'
import authRoutes from './routes/auth.routes.js'
import vehiculosRoutes from './routes/vehiculos.routes.js'
import { errorHandler, notFound } from './middleware/errorHandler.js'

const app = express()

// Orígenes del .env + la propia API (para que Swagger pueda llamar al servidor)
const origenes = new Set([
  ...(process.env.CORS_ORIGINS || 'http://localhost:5173').split(',').map(o => o.trim()),
  `http://localhost:${process.env.PORT || 3002}`
])

app.use(cors({
  origin: (origin, cb) => (!origin || origenes.has(origin)) ? cb(null, true) : cb(new Error('Origen no permitido por CORS')),
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json())

app.get('/', (req, res) => res.json({ api: 'CentralGuard - Vehículos', docs: '/api/docs' }))
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.use('/api/auth', authRoutes)
app.use('/api/vehiculos', vehiculosRoutes)

app.use(notFound)
app.use(errorHandler)

export default app
