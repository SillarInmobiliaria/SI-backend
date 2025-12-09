import { Request, Response } from 'express';
import Propietario from '../models/Propietario';

// Obtener todos los propietarios
export const getPropietarios = async (req: Request, res: Response) => {
  try {
    const propietarios = await Propietario.findAll();
    res.json(propietarios);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener propietarios' });
  }
};

// Crear un nuevo propietario
export const createPropietario = async (req: Request, res: Response) => {
  try {
    // 👇 SOLUCIÓN: Pasamos req.body completo o desestructuramos TODO
    const { 
      nombre, dni, fechaNacimiento, direccion, email, 
      celular1, celular2, asesor, fechaAlta, detalles, 
      banco, cuenta, cci 
    } = req.body;

    const nuevoPropietario = await Propietario.create({
      nombre,
      dni,
      fechaNacimiento,
      direccion,
      email,
      celular1,
      celular2,
      asesor,
      fechaAlta,
      detalles,
      banco,
      cuenta,
      cci
    });

    res.status(201).json({ message: 'Propietario creado', data: nuevoPropietario });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear propietario', error: error.message });
  }
};