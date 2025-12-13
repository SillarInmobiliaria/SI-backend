import { Request, Response } from 'express';
import Usuario from '../models/Usuario';
import Notificacion from '../models/Notificacion';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'sillar_secreto_super_seguro';

// 1. INICIAR SESIÓN (LOGIN)
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // A. Buscar usuario
    const usuario = await Usuario.findOne({ where: { email } });
    
    if (!usuario) {
      res.status(404).json({ message: 'Usuario no encontrado' });
      return;
    }

    // Convertimos a objeto plano
    const usuarioData = usuario.get({ plain: true }) as any;

    // B. Verificar si está activo
    if (usuarioData.activo === false) { 
      res.status(403).json({ 
        message: `Cuenta SUSPENDIDA. Contacte al administrador.` 
      });
      return;
    }

    // C. Verificar contraseña (CRÍTICO)
    // Compara lo que escribes con el hash de la BD
    const esValida = await bcrypt.compare(password, usuarioData.password);
    
    if (!esValida) {
      console.log(`❌ Intento fallido para ${email}. Pass enviado: ${password}`);
      res.status(401).json({ message: 'Contraseña incorrecta' });
      return;
    }

    // D. Generar Token
    const token = jwt.sign(
      { id: usuarioData.id, rol: usuarioData.rol }, 
      JWT_SECRET, 
      { expiresIn: '8h' }
    );

    // E. Responder
    res.json({
      message: 'Login exitoso',
      token,
      usuario: {
        id: usuarioData.id,
        nombre: usuarioData.nombre,
        email: usuarioData.email,
        rol: usuarioData.rol
      }
    });

  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// ... (puedes dejar el resto de funciones cambiarPassword y registrarAdmin igual)
export const cambiarPassword = async (req: Request, res: Response): Promise<void> => { /* ... */ };
export const registrarAdmin = async (req: Request, res: Response): Promise<void> => { /* ... */ };