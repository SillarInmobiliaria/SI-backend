import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'sillar_secreto_super_seguro';

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'Acceso denegado. No hay token.' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    (req as any).user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: 'Token inválido o expirado.' });
  }
};

export const verificarToken = authMiddleware;

export const esAdmin = (req: Request, res: Response, next: NextFunction): void => {
  const usuario = (req as any).user;

  // Verificamos si existe el usuario y si su rol es ADMIN
  if (!usuario || usuario.rol !== 'ADMIN') {
    res.status(403).json({ message: 'Acceso prohibido. Se requiere rol de Administrador.' });
    return;
  }

  next(); 
};