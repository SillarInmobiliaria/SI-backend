import { Request, Response } from 'express';
import Usuario from '../models/Usuario';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Clave secreta para el token (Debería ir en .env, pero por ahora hardcodeada para desarrollo)
const JWT_SECRET = process.env.JWT_SECRET || 'sillar_secreto_super_seguro';

// --- LOGIN ---
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // 1. Buscar usuario
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      res.status(404).json({ message: 'Usuario no encontrado' });
      return;
    }

    // 2. Verificar si está activo
    // @ts-ignore (Si TypeScript se queja del campo activo)
    if (usuario.activo === false) { 
      res.status(403).json({ message: 'Usuario desactivado. Contacte al administrador.' });
      return;
    }

    // 3. Verificar contraseña
    const esValida = await bcrypt.compare(password, usuario.password);
    if (!esValida) {
      res.status(401).json({ message: 'Contraseña incorrecta' });
      return;
    }

    // 4. Generar Token (Dura 8 horas)
    const token = jwt.sign(
      { id: usuario.id, rol: (usuario as any).rol }, 
      JWT_SECRET, 
      { expiresIn: '8h' }
    );

    // 5. Responder (Incluyendo la bandera mustChangePassword)
    res.json({
      message: 'Login exitoso',
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: (usuario as any).rol,
        // 👇 Esto le dice al Frontend si debe redirigir a "Cambiar Contraseña"
        mustChangePassword: usuario.mustChangePassword 
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// --- CAMBIAR CONTRASEÑA (Para cuando es temporal) ---
export const cambiarPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, nuevaPassword } = req.body;

    const usuario = await Usuario.findByPk(userId);
    if (!usuario) {
      res.status(404).json({ message: 'Usuario no encontrado' });
      return;
    }

    // Actualizar contraseña (el hook beforeUpdate del modelo la encriptará automáticamente)
    usuario.password = nuevaPassword;
    usuario.mustChangePassword = false; // Ya no es temporal
    await usuario.save();

    res.json({ message: 'Contraseña actualizada correctamente. Por favor inicia sesión de nuevo.' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al cambiar contraseña' });
  }
};

// --- REGISTRO DE ADMIN (Solo para crear el primer usuario CEO) ---
export const registrarAdmin = async (req: Request, res: Response): Promise<void> => {
    try {
        const { nombre, email, password } = req.body;
        // Creamos usuario con rol ADMIN y sin necesidad de cambio de pass inmediato
        const usuario = await Usuario.create({
            nombre,
            email,
            password,
            rol: 'ADMIN',
            mustChangePassword: false 
        });
        res.status(201).json({ message: 'Admin creado', usuario });
    } catch (error) {
        res.status(500).json({ message: 'Error creando admin', error });
    }
}