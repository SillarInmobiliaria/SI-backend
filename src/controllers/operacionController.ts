import { Request, Response } from 'express';
import Operacion from '../models/Operacion';
import Propiedad from '../models/Propiedad';
import Cliente from '../models/Cliente';

export const crearOperacion = async (req: Request, res: Response) => {
  try {
    const nuevaOperacion = await Operacion.create(req.body);
    res.status(201).json({ message: 'Gestión registrada', data: nuevaOperacion });
  } catch (error: any) {
    res.status(500).json({ message: 'Error al registrar', error: error.message });
  }
};

export const obtenerOperaciones = async (req: Request, res: Response) => {
  try {
    const operaciones = await Operacion.findAll({
      include: [Propiedad, Cliente] // Traemos datos de la casa y el cliente
    });
    res.json(operaciones);
  } catch (error: any) {
    res.status(500).json({ message: 'Error al obtener', error: error.message });
  }
};