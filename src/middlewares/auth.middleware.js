import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ 
            success: false, 
            message: 'Acceso denegado. No se proporcionó un token de autenticación.' 
        });
    }

    try {
        const secretKey = process.env.JWT_SECRET || 'clave_secreta_centralguard_2026';
        const verified = jwt.verify(token, secretKey);
        
        req.user = verified;
        
        next();
    } catch (error) {
        return res.status(403).json({ 
            success: false, 
            message: 'Token inválido o expirado.' 
        });
    }
};

export { verifyToken };