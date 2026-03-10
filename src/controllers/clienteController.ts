import { Request, Response } from 'express';
import Cliente from '../models/Cliente';

const limpiarCampo = (valor: any) => {
    if (valor === '' || valor === 'null' || valor === undefined) return null;
    return valor;
};

// 1. CREAR CLIENTE
export const crearCliente = async (req: Request, res: Response) => {
  try {
    const usuario = (req as any).user;
    
    // Validar autenticación
    if (!usuario || !usuario.id) {
      return res.status(401).json({ message: 'No autorizado: usuario no identificado' });
    }

    const { 
        nombre, telefono1, dni, email, direccion, fechaNacimiento,
        telefono2, estadoCivil, ocupacion, fechaAlta, origen, detalles
    } = req.body;

    // Validar campos requeridos
    if (!nombre || !telefono1) {
      return res.status(400).json({ message: 'Nombre y celular son requeridos' });
    }

    const nuevoCliente = await Cliente.create({
      nombre,
      telefono1,
      dni: limpiarCampo(dni),
      email: limpiarCampo(email),
      direccion: limpiarCampo(direccion),
      fechaNacimiento: limpiarCampo(fechaNacimiento),
      telefono2: limpiarCampo(telefono2),
      estadoCivil: limpiarCampo(estadoCivil),
      ocupacion: limpiarCampo(ocupacion),
      fechaAlta: limpiarCampo(fechaAlta) || new Date(),
      tipo: 'PROSPECTO',
      origen: limpiarCampo(origen),
      detalles: limpiarCampo(detalles),
      usuarioId: usuario.id,
      activo: true
    });

    res.status(201).json(nuevoCliente);
  } catch (error: any) {
    console.error('Error en crearCliente:', error);
    if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({ message: 'El DNI o documento ya se encuentra registrado.' });
    }
    res.status(500).json({ message: 'Error al crear cliente', error: error.message });
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

// 3. ACTUALIZAR CLIENTE
export const actualizarCliente = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nombre, telefono1, dni, email, origen, fechaAlta, detalles } = req.body;

    const cliente = await Cliente.findByPk(id);

    if (!cliente) return res.status(404).json({ message: 'Cliente no encontrado' });

    await cliente.update({
        nombre,
        telefono1,
        dni: limpiarCampo(dni),
        email: limpiarCampo(email),
        origen: limpiarCampo(origen),
        fechaAlta: limpiarCampo(fechaAlta) || (cliente as any).fechaAlta,
        detalles: limpiarCampo(detalles)
    });

    res.json({ message: 'Cliente actualizado correctamente', cliente });
  } catch (error: any) {
    console.error(error);
    if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({ message: 'El DNI o documento ya se encuentra registrado.' });
    }
    res.status(500).json({ message: 'Error al actualizar cliente', error: error.message });
  }
};

// 4. SUSPENDER / ACTIVAR
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

// 5. ELIMINAR
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