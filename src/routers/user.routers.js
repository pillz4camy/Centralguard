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
router.put('/', actualizarUsers);
router.patch('/', actualizarParcialUsers);
router.delete('/', eliminarUsers);

export default router;