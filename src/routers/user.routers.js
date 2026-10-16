import { Router } from "express";
import { 
    getUsers, 
    registrarUsers, 
    actualizarUsers, 
    actualizarParcialUsers, 
    eliminarUsers 
} from "../controllers/user.controllers.js";

const router = Router();

router.get('/', getUsers);
router.post('/', registrarUsers);
router.put('/:id', actualizarUsers);       // Agregado :id
router.patch('/:id', actualizarParcialUsers); // Agregado :id
router.delete('/:id', eliminarUsers);    // Agregado :id

export default router;