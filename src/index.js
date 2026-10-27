import express from 'express';
import pedidoRouter from './routers/pedido.routers.js';
import './config/mongo.config.js';

const app = express();

app.use(express.json());

app.use('/api/pedidos', pedidoRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});