import { Router } from "express";
import { 
    getUsers, 
    getUserById, 
    registrarUsers, 
    actualizarUsers, 
    eliminarUsers,
    loginUser 
} from "../controllers/user.controllers.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = Router();

router.post('/', registrarUsers);
router.post('/login', loginUser);

router.get('/', verifyToken, getUsers);
router.get('/:id', verifyToken, getUserById);
router.put('/:id', verifyToken, actualizarUsers);       
router.delete('/:id', verifyToken, eliminarUsers);    

export default router;