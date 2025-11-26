import { Request, Response } from 'express';
import Propietario from '../models/Propietario';

export const crearPropietario = async (req: Request, res: Response) => {
  try {
    // 1. Recibimos los datos del Postman/Frontend
    const { nombre, dni, fechaNacimiento, direccion, banco, cuenta, cci, email } = req.body;

    // 2. Creamos el registro en la BD
    const nuevoPropietario = await Propietario.create({
      nombre,
      dni,
      fechaNacimiento,
      direccion,
      banco,
      cuenta,
      cci,
      email
    });

    // 3. Respondemos con el dato creado
    res.status(201).json({
      message: 'Propietario registrado con éxito',
      data: nuevoPropietario
    });

  } catch (error: any) {
    console.error(error);
    res.status(500).json({ 
      message: 'Error al registrar propietario', 
      error: error.message 
    });
  }
};

export const obtenerPropietarios = async (req: Request, res: Response) => {
    try {
        const propietarios = await Propietario.findAll();
        res.json(propietarios);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener propietarios' });
    }
};