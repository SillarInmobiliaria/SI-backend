import { Request, Response } from 'express';
import Seguimiento from '../models/Seguimiento';
import Cliente from '../models/Cliente';
import Propiedad from '../models/Propiedad';

export const crearSeguimiento = async (req: Request, res: Response) => {
  try {
    const nuevo = await Seguimiento.create(req.body);
    res.status(201).json({ message: 'Seguimiento registrado', data: nuevo });
  } catch (error: any) {
    res.status(500).json({ message: 'Error al registrar', error: error.message });
  }
};

export const obtenerSeguimientos = async (req: Request, res: Response) => {
  try {
    const lista = await Seguimiento.findAll({
      include: [Cliente, Propiedad],
      order: [['fecha', 'DESC']]
    });
    res.json(lista);
  } catch (error: any) {
    res.status(500).json({ message: 'Error al obtener', error: error.message });
  }
};