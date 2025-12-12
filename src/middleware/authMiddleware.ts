import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'sillar_secreto_super_seguro';

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  // 1. Obtener el header Authorization
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer TOKEN"

  if (!token) {
    res.status(401).json({ message: 'Acceso denegado. No hay token.' });
    return;
  }

  try {
    // 2. Verificar el token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // 3. Guardar datos del usuario en la request para usarlos luego
    (req as any).user = decoded;
    
    next(); // Pasar al siguiente controlador
  } catch (error) {
    res.status(403).json({ message: 'Token inválido o expirado.' });
  }
};