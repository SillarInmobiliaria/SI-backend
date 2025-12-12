import { Request, Response } from 'express';
import Propietario from '../models/Propietario';

// CREAR PROPIETARIO (Con marca de dueño)
export const crearPropietario = async (req: Request, res: Response) => {
  try {
    const usuario = (req as any).user; // Obtenemos quién lo crea
    
    const nuevoPropietario = await Propietario.create({
      ...req.body,
      usuarioId: usuario.id
    });
    
    res.status(201).json(nuevoPropietario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear propietario' });
  }
};

// OBTENER PROPIETARIOS (Con filtro de seguridad)
export const obtenerPropietarios = async (req: Request, res: Response) => {
  try {
    const usuario = (req as any).user;
    let whereClause = {};

    // 🕵️‍♂️ SI NO ES ADMIN, FILTRAMOS
    // Solo ve los propietarios que él mismo creó
    if (usuario.rol !== 'ADMIN') {
        whereClause = { usuarioId: usuario.id };
    }

    const propietarios = await Propietario.findAll({ 
        where: whereClause,
        order: [['createdAt', 'DESC']] 
    });
    
    res.json(propietarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener propietarios' });
  }
};