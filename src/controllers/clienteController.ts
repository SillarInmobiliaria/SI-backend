import { Request, Response } from 'express';
import Cliente from '../models/Cliente';

// 1. CREAR CLIENTE
export const crearCliente = async (req: Request, res: Response) => {
  try {
    const usuario = (req as any).user;
    
    // Validar autenticación
    if (!usuario || !usuario.id) {
      return res.status(401).json({ message: 'No autorizado: usuario no identificado' });
    }

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
        origen,
        detalles
    } = req.body;

    // Validar campos requeridos
    if (!nombre || !telefono1) {
      return res.status(400).json({ message: 'Nombre y celular son requeridos' });
    }

    // Lógica automática de TIPO: siempre comienza como PROSPECTO (Interesado)
    const tipoCalculado = 'PROSPECTO'; // Siempre PROSPECTO, ignorar tipo del frontend

    const nuevoCliente = await Cliente.create({
      nombre,
      telefono1,
      dni: dni || null,
      email: email || null,
      direccion: direccion || null,
      fechaNacimiento: fechaNacimiento || null,
      telefono2: telefono2 || null,
      estadoCivil: estadoCivil || null,
      ocupacion: ocupacion || null,
      fechaAlta: fechaAlta || new Date(),
      tipo: tipoCalculado,
      origen: origen || null,
      detalles: detalles || null,
      usuarioId: usuario.id,
      activo: true
    });

    res.status(201).json(nuevoCliente);
  } catch (error) {
    console.error('Error en crearCliente:', error);
    res.status(500).json({ message: 'Error al crear cliente', error: (error as any).message || error });
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
    const { 
        nombre, 
        telefono1, 
        dni, 
        email, 
        origen, 
        fechaAlta,
        detalles
    } = req.body;

    const cliente = await Cliente.findByPk(id);

    if (!cliente) return res.status(404).json({ message: 'Cliente no encontrado' });

    const tipoCalculado = cliente.tipo;

    await cliente.update({
        nombre,
        telefono1,
        dni: dni || null,
        email: email || null,
        origen,
        fechaAlta: fechaAlta || (cliente as any).fechaAlta,
        tipo: tipoCalculado,
        detalles
    });

    res.json({ message: 'Cliente actualizado correctamente', cliente });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar cliente', error });
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