// const express = require('express');   // CommonJS
import express from 'express';           // ESModule

const app = express();

// Definiendo 1 endpoint (ruta de entrada)
app.get('/health', (req, res) => {
    res.json({ msg: 'Servidor de SenaStore Funcionando!' });
});

// Obtener todos usuarios
app.get('/users', (req, res) => {
    res.json({ msg: 'Listar todos los usuarios' });
});

// Crear un usuario
app.post('/users', (req, res) => {
    res.json({ msg: 'Registra usuario' });
});

// Actualizar totalmente
app.put('/users', (req, res) => {
    res.json({ msg: 'Actualizar todos las propiedades de un usuario' });
});

// Actualizar parcialmente
app.patch('/users', (req, res) => {
    res.json({ msg: 'Actualizar una o mas propiedades del usuario' });
});

// Eliminar un usuario
app.delete('/users', (req, res) => {
    res.json({ msg: 'Elimina un usuario' });
});


// Iniciar el servidor
const port = 3000;
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});