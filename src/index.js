import express from 'express';           
import conexion from './config/mongo.config.js'; 
import userRouter from './routers/user.routers.js'; 
import equipmentRouter from './routers/equipment.routers.js';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

conexion();

app.get('/health', (req, res) => {
    res.json({ msg: 'Servidor de CentralGuard Funcionando correctamente!' });
});

// Montar Rutas
app.use("/api/users", userRouter); 
app.use("/api/equipos", equipmentRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});