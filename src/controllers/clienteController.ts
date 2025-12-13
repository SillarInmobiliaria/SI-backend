import { Request, Response } from 'express';
import Cliente from '../models/Cliente';

// 1. CREAR
export const crearCliente = async (req: Request, res: Response) => {
  try {
    const usuario = (req as any).user;
    const nuevoCliente = await Cliente.create({
      ...req.body,
      usuarioId: usuario.id,
      activo: true
    });
    res.status(201).json(nuevoCliente);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear cliente', error });
  }
};

// 2. OBTENER (CORREGIDO: Muestra todo para que no se "pierdan")
export const obtenerClientes = async (req: Request, res: Response) => {
  try {
    const usuario = (req as any).user;
    let whereClause: any = {};

    // El Asesor ve solo los suyos (activos o suspendidos). El Admin ve TODO.
    if (usuario.rol !== 'ADMIN') {
        whereClause = { usuarioId: usuario.id };
    }

    const clientes = await Cliente.findAll({ 
        where: whereClause,
        order: [['createdAt', 'DESC']]
    });
    
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener clientes' });
  }
};

// 3. SUSPENDER / ACTIVAR
export const toggleEstadoCliente = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { activo } = req.body;
        const cliente = await Cliente.findByPk(id);

        if (!cliente) return res.status(404).json({ message: 'Cliente no encontrado' });

        await cliente.update({ activo });
        res.json({ message: `Estado actualizado correctamente` });
    } catch (error) {
        res.status(500).json({ message: 'Error al cambiar estado' });
    }
};

// 4. ELIMINAR
export const eliminarCliente = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const cliente = await Cliente.findByPk(id);

        if (!cliente) return res.status(404).json({ message: 'Cliente no encontrado' });

        await cliente.destroy();
        res.json({ message: 'Cliente eliminado permanentemente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar' });
    }
};