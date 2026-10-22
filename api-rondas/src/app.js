import express from 'express'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import { swaggerSpec } from './config/swagger.js'
import authRoutes from './routes/auth.routes.js'
import rondasRoutes from './routes/rondas.routes.js'
import { errorHandler, notFound } from './middleware/errorHandler.js'

const app = express()

const origenes = (process.env.CORS_ORIGINS || 'http://localhost:5173').split(',').map(o => o.trim())
app.use(cors({
  origin: (origin, cb) => (!origin || origenes.includes(origin)) ? cb(null, true) : cb(new Error('Origen no permitido por CORS')),
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json())

app.get('/', (req, res) => res.json({ api: 'CentralGuard - Rondas', docs: '/api/docs' }))
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.use('/api/auth', authRoutes)
app.use('/api/rondas', rondasRoutes)

app.use(notFound)
app.use(errorHandler)

export default app
