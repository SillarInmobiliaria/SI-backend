import { Request, Response } from 'express';
import Usuario from '../models/Usuario';
import jwt from 'jsonwebtoken'; // Para crear el "pase" de entrada

// Clave secreta para firmar los tokens (idealmente iría en .env)
const JWT_SECRET = process.env.JWT_SECRET || 'palabra_secreta_super_segura';

export const registro = async (req: Request, res: Response) => {
  try {
    const { nombre, email, password } = req.body;

    // Verificar si ya existe
    const existe = await Usuario.findOne({ where: { email } });
    if (existe) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // Crear usuario (el modelo encripta la password solo)
    const usuario = await Usuario.create({ nombre, email, password });

    res.status(201).json({ message: 'Usuario registrado correctamente', usuarioId: usuario.getDataValue('id') });
  } catch (error: any) {
    res.status(500).json({ message: 'Error al registrar', error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // 1. Buscar usuario
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // 2. Verificar contraseña
    // @ts-ignore
    const esCorrecta = await usuario.compararPassword(password);
    if (!esCorrecta) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // 3. Generar Token (El pase VIP)
    const token = jwt.sign(
      { id: usuario.getDataValue('id'), nombre: usuario.getDataValue('nombre') }, 
      JWT_SECRET, 
      { expiresIn: '1d' } // Dura 1 día
    );

    res.json({ 
      message: 'Login exitoso', 
      token, 
      usuario: { 
        nombre: usuario.getDataValue('nombre'), 
        email: usuario.getDataValue('email') 
      } 
    });

  } catch (error: any) {
    res.status(500).json({ message: 'Error en el login', error: error.message });
  }
};