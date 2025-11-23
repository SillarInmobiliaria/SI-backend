import { Request, Response } from 'express';
import Visita from '../models/Visita';
import Cliente from '../models/Cliente';
import Propiedad from '../models/Propiedad';

export const crearVisita = async (req: Request, res: Response) => {
  try {
    const nuevaVisita = await Visita.create(req.body);
    res.status(201).json({ message: 'Visita registrada', data: nuevaVisita });
  } catch (error: any) {
    console.error(error); // Para ver el error real en la terminal
    res.status(500).json({ message: 'Error al registrar visita', error: error.message });
  }
};

export const obtenerVisitas = async (req: Request, res: Response) => {
  try {
    const visitas = await Visita.findAll({
      include: [Cliente, Propiedad],
      order: [['fecha', 'DESC'], ['hora', 'DESC']]
    });
    res.json(visitas);
  } catch (error: any) {
    res.status(500).json({ message: 'Error al obtener visitas', error: error.message });
  }
};