import { Router } from "express";
import { 
    getUsers, 
    getUserById, 
    registrarUsers, 
    actualizarUsers, 
    actualizarParcialUsers, 
    eliminarUsers,
    loginUser 
} from "../controllers/user.controllers.js";
import { verifyToken } from "../middlewares/auth.middleware.js"; // <--- Importar el middleware

const router = Router();

router.post('/', registrarUsers);
router.post('/login', loginUser);


router.get('/', verifyToken, getUsers);
router.get('/:id', verifyToken, getUserById);
router.put('/:id', verifyToken, actualizarUsers);       
router.patch('/:id', verifyToken, actualizarParcialUsers); 
router.delete('/:id', verifyToken, eliminarUsers);    

export default router;