import { Request, Response } from 'express';
import Usuario from '../models/Usuario';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'sillar_secreto_super_seguro';

// 1. INICIAR SESIÓN
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario
    const usuario = await Usuario.findOne({ where: { email } });
    
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Convertimos a objeto plano para manejar propiedades fácilmente
    const usuarioData = usuario.get({ plain: true }) as any;

    // Verificar si está activo
    if (usuarioData.activo === false) { 
      return res.status(403).json({ 
        message: `Cuenta SUSPENDIDA. Contacte al administrador.` 
      });
    }

    // Verificar contraseña
    const esValida = await bcrypt.compare(password, usuarioData.password);
    
    if (!esValida) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // Generar Token
    const token = jwt.sign(
      { id: usuarioData.id, rol: usuarioData.rol }, 
      JWT_SECRET, 
      { expiresIn: '8h' }
    );

    // Responder
    // IMPORTANTE: Enviamos 'mustChangePassword' para que el Front sepa si mostrar la alerta
    res.json({
      message: 'Login exitoso',
      token,
      usuario: {
        id: usuarioData.id,
        nombre: usuarioData.nombre,
        email: usuarioData.email,
        rol: usuarioData.rol,
        mustChangePassword: usuarioData.mustChangePassword
      }
    });

  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// 2. CAMBIAR CONTRASEÑA
export const cambiarPassword = async (req: Request, res: Response) => {
    try {
        const { password } = req.body;
        const userId = (req as any).user.id; 

        if (!password || password.length < 6) {
            return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });
        }

        // Encriptar la nueva contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Actualizar en Base de Datos
        await Usuario.update(
            { 
                password: hashedPassword, 
                mustChangePassword: false
            },
            { where: { id: userId } }
        );

        res.json({ message: 'Contraseña actualizada correctamente' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor al cambiar contraseña' });
    }
};

// 3. REGISTRAR ADMIN
export const registrarAdmin = async (req: Request, res: Response) => {
    try {
        const { nombre, email, password, celular } = req.body;

        const existe = await Usuario.findOne({ where: { email } });
        if(existe) return res.status(400).json({ message: 'El usuario ya existe' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const nuevo = await Usuario.create({
            nombre,
            email,
            password: hashedPassword,
            rol: 'ADMIN',
            celular,
            activo: true,
            mustChangePassword: false
        });

        res.status(201).json(nuevo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al registrar' });
    }
};