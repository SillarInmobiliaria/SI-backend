import { Request, Response } from 'express';
import Cliente from '../models/Cliente';

// 1. CREAR CLIENTE
export const crearCliente = async (req: Request, res: Response) => {
  try {
    const usuario = (req as any).user;
    
    // Desestructuramos para tener control total de lo que guardamos
    const { 
        nombre, 
        telefono1, 
        dni, 
        email, 
        direccion, 
        fechaNacimiento,
        telefono2, 
        estadoCivil, 
        ocupacion, 
        fechaAlta, 
        tipo, 
        origen
    } = req.body;

    // Lógica automática de TIPO
    let tipoCalculado = tipo;
    if (!tipo) {
        tipoCalculado = (dni && email) ? 'CLIENTE' : 'PROSPECTO';
    }

    const nuevoCliente = await Cliente.create({
      nombre,
      telefono1,
      dni: dni || null,
      email: email || null,
      direccion,
      fechaNacimiento,
      telefono2,
      estadoCivil,
      ocupacion,
      fechaAlta: fechaAlta || new Date(),
      tipo: tipoCalculado,
      origen,
      usuarioId: usuario.id,
      activo: true
    });

    res.status(201).json(nuevoCliente);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear cliente', error });
  }
};

// 2. OBTENER CLIENTES
export const obtenerClientes = async (req: Request, res: Response) => {
  try {
    const usuario = (req as any).user;
    let whereClause: any = {};

    // El Asesor ve solo los suyos (activos o suspendidos)
    if (usuario.rol !== 'ADMIN') {
        whereClause = { usuarioId: usuario.id };
    }

    const clientes = await Cliente.findAll({ 
        where: whereClause,
        order: [['fechaAlta', 'DESC'], ['createdAt', 'DESC']]
    });
    
    res.json(clientes);
  } catch (error) {
    console.error(error);
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