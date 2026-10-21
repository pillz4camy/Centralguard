import express from 'express';           
import conexion from './config/mongo.config.js'; // 1. Importas la conexión de MongoDB
import userRouter from './routers/user.routers.js'; 
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// 2. Ejecutas la conexión a la base de datos
conexion();

// Ruta de prueba general (Health check)
app.get('/health', (req, res) => {
    res.json({ msg: 'Servidor de CentralGuard Funcionando!' });
});

// Rutas de usuarios manejadas por el enrutador (/api/users)
app.use("/api/users", userRouter); 

// Iniciar el servidor
const port = 3000;
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});