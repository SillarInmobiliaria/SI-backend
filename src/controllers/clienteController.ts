import { Request, Response } from 'express';
import Cliente from '../models/Cliente';

// CREAR CLIENTE (Marcamos quién lo creó)
export const crearCliente = async (req: Request, res: Response) => {
  try {
    // Obtenemos el usuario del token (gracias al authMiddleware)
    const usuario = (req as any).user; 

    const nuevoCliente = await Cliente.create({
      ...req.body,
      usuarioId: usuario.id // 👈 ¡AQUÍ GUARDAMOS AL DUEÑO!
    });

    res.status(201).json(nuevoCliente);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear cliente' });
  }
};

// OBTENER CLIENTES (Filtro de seguridad)
export const obtenerClientes = async (req: Request, res: Response) => {
  try {
    const usuario = (req as any).user;
    let whereClause = {};

    // Si NO es Admin, solo puede ver SU PROPIA data
    if (usuario.rol !== 'ADMIN') {
        whereClause = { usuarioId: usuario.id };
    }
    // (Si es ADMIN, whereClause se queda vacío y ve todo)

    const clientes = await Cliente.findAll({ 
        where: whereClause,
        order: [['createdAt', 'DESC']]
    });
    
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener clientes' });
  }
};