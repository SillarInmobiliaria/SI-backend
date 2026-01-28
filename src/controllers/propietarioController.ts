import { Request, Response } from 'express';
import Propietario from '../models/Propietario';

// 1. CREAR
export const crearPropietario = async (req: Request, res: Response) => {
  try {
    const usuario = (req as any).user;
    
    console.log("Intentando crear propietario con datos:", req.body);

    const nuevoPropietario = await Propietario.create({
      ...req.body,
      usuarioId: usuario.id,
      activo: true
    });
    
    res.status(201).json(nuevoPropietario);
  } catch (error: any) {
    console.error("❌ Error CRÍTICO al crear propietario:", error);
    res.status(500).json({ 
        message: 'Error al crear propietario', 
        error: error.message || error 
    });
  }
};

// 2. OBTENER
export const obtenerPropietarios = async (req: Request, res: Response) => {
  try {
    const usuario = (req as any).user;
    let whereClause: any = {};

    // Si NO es Admin, solo ve SU data (Esto explica por qué tu lista sale vacía al inicio)
    if (usuario.rol !== 'ADMIN') {
        whereClause = { usuarioId: usuario.id };
    }

    const propietarios = await Propietario.findAll({ 
        where: whereClause,
        order: [['createdAt', 'DESC']] 
    });
    res.json(propietarios);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener propietarios' });
  }
};

// 3. SUSPENDER
export const toggleEstadoPropietario = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { activo } = req.body;
        const propietario = await Propietario.findByPk(id);
        if (!propietario) return res.status(404).json({ message: 'No encontrado' });
        await propietario.update({ activo });
        res.json({ message: `Estado actualizado` });
    } catch (error) {
        res.status(500).json({ message: 'Error al cambiar estado' });
    }
};

// 4. ELIMINAR
export const eliminarPropietario = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const propietario = await Propietario.findByPk(id);
        if (!propietario) return res.status(404).json({ message: 'No encontrado' });
        await propietario.destroy();
        res.json({ message: 'Eliminado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar' });
    }
};