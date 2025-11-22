import { Request, Response } from 'express';
import Cliente from '../models/Cliente';

export const crearCliente = async (req: Request, res: Response) => {
  try {
    const cliente = await Cliente.create(req.body);
    res.status(201).json({ message: 'Cliente registrado', data: cliente });
  } catch (error: any) {
    res.status(500).json({ message: 'Error al registrar cliente', error: error.message });
  }
};

export const obtenerClientes = async (req: Request, res: Response) => {
  try {
    const clientes = await Cliente.findAll();
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener clientes' });
  }
};