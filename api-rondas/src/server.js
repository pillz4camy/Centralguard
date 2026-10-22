import 'dotenv/config'
import app from './app.js'
import { conectarDB } from './config/db.js'

const PORT = process.env.PORT || 3000

try {
  if (!process.env.JWT_SECRET) throw new Error('Falta JWT_SECRET en el archivo .env')
  await conectarDB()
  app.listen(PORT, () => console.log(`API lista en http://localhost:${PORT}  |  Docs: http://localhost:${PORT}/api/docs`))
} catch (err) {
  console.error('No se pudo iniciar la API:', err.message)
  process.exit(1)
}
