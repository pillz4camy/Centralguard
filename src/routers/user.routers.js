import { Router } from "express";

const router = Router();

router.get('/', (req, res) => {
    res.json({ msg: 'Obtiene todos los usuarios' }); 
});

router.post('/', (req, res) => {
    res.json({ msg: 'Registra usuario' });
});

router.put('/', (req, res) => {
    res.json({ msg: 'Actualizar todas las propiedades de un usuario' });
});

router.patch('/', (req, res) => {
    res.json({ msg: 'Actualizar una o mas propiedades del usuario' });
});

router.delete('/', (req, res) => {
    res.json({ msg: 'Elimina un usuario' });
});

export default router;