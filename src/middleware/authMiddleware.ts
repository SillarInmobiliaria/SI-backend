import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'sillar_secreto_super_seguro';

// Extender la interfaz Request para que acepte el usuario
export interface AuthRequest extends Request {
    usuario?: any;
}

// 1. Verificar Token (¿Está logueado?)
export const verificarToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        res.status(401).json({ message: 'Acceso denegado. No hay token.' });
        return;
    }

    try {
        const verificado = jwt.verify(token, JWT_SECRET);
        req.usuario = verificado;
        next(); // Pasa al siguiente paso
    } catch (error) {
        res.status(400).json({ message: 'Token inválido o expirado.' });
    }
};

// 2. Verificar Rol Admin (¿Es jefe?)
export const esAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (req.usuario && req.usuario.rol === 'ADMIN') {
        next(); // Pasa, es jefe
    } else {
        res.status(403).json({ message: 'Acceso prohibido. Se requiere rol de ADMIN.' });
    }
};