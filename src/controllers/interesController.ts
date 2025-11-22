import { Request, Response } from 'express';
import Interes from '../models/Interes';
import Cliente from '../models/Cliente';
import Propiedad from '../models/Propiedad';
import Propietario from '../models/Propietario';

export const crearInteres = async (req: Request, res: Response) => {
  try {
    const { clienteId, propiedadId, nota } = req.body;

    // Crear el registro
    const nuevoInteres = await Interes.create({
      clienteId,
      propiedadId,
      nota
    });

    res.status(201).json({ message: 'Interés registrado', data: nuevoInteres });
  } catch (error: any) {
    res.status(500).json({ message: 'Error al registrar interés', error: error.message });
  }
};

export const obtenerIntereses = async (req: Request, res: Response) => {
  try {
    // Este es un JOIN triple: Interes -> Cliente Y Interes -> Propiedad -> Propietario
    const intereses = await Interes.findAll({
      include: [
        { model: Cliente }, 
        { 
          model: Propiedad, 
          include: [Propietario] // Para saber de quién es la casa que le gusta
        }
      ]
    });
    res.json(intereses);
  } catch (error: any) {
    res.status(500).json({ message: 'Error al obtener intereses', error: error.message });
  }
};