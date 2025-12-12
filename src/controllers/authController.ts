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

    // B. Verificar si está activo (AHORA CON MOTIVO)
    // @ts-ignore
    if (usuario.dataValues.activo === false) { 
      // 👇 RECUPERAMOS EL MOTIVO DE LA BASE DE DATOS
      // @ts-ignore
      const motivo = usuario.dataValues.motivoSuspension || 'Sin motivo especificado';
      
      // 👇 LO INCLUIMOS EN EL MENSAJE DE ERROR
      res.status(403).json({ 
        message: `Cuenta SUSPENDIDA. Motivo: "${motivo}". Contacte al administrador.` 
      });
      return;
    }

    // 💀 LÓGICA DE "MUERTE SÚBITA" (30 DÍAS)
    if (usuario.dataValues.mustChangePassword) {
      const fechaCreacion = new Date(usuario.dataValues.createdAt);
      const fechaActual = new Date();
      
      const diferenciaTiempo = fechaActual.getTime() - fechaCreacion.getTime();
      const diasTranscurridos = Math.ceil(diferenciaTiempo / (1000 * 3600 * 24));
      
      if (diasTranscurridos > 30) {
        
        // 1. Desactivar usuario
        // @ts-ignore
        usuario.activo = false;
        // @ts-ignore
        usuario.motivoSuspension = 'Inactividad automática (30 días sin cambio de clave)';
        await usuario.save(); 

        // 2. Crear Notificación
        try {
            await Notificacion.create({
                mensaje: `El asesor ${usuario.dataValues.nombre} (${usuario.dataValues.email}) fue desactivado automáticamente por inactividad.`,
                tipo: 'ALERTA',
                usuarioAfectadoId: usuario.dataValues.id
            });
        } catch (error) {
            console.error('Error notif:', error);
        }

        res.status(403).json({ 
          message: 'Tu periodo de prueba de 30 días expiró. Cuenta desactivada automáticamente.' 
        });
        return;
      }
    }

    // C. Verificar contraseña
    const esValida = await bcrypt.compare(password, (usuario as any).password);
    
    if (!esValida) {
      res.status(401).json({ message: 'Contraseña incorrecta' });
      return;
    }

    // D. Generar Token
    const token = jwt.sign(
      { id: usuario.dataValues.id, rol: usuario.dataValues.rol }, 
      JWT_SECRET, 
      { expiresIn: '8h' }
    );

    // E. Responder
    res.json({
      message: 'Login exitoso',
      token,
      usuario: {
        id: usuario.dataValues.id,
        nombre: usuario.dataValues.nombre,
        email: usuario.dataValues.email,
        rol: usuario.dataValues.rol,
        mustChangePassword: usuario.dataValues.mustChangePassword,
        createdAt: usuario.dataValues.createdAt
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// 2. CAMBIAR CONTRASEÑA

export const cambiarPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, nuevaPassword } = req.body;

    const usuario = await Usuario.findByPk(userId);
    if (!usuario) {
      res.status(404).json({ message: 'Usuario no encontrado' });
      return;
    }

    usuario.password = nuevaPassword;
    usuario.mustChangePassword = false;
    await usuario.save();

    res.json({ message: 'Contraseña actualizada correctamente.' });

  } catch (error) {
    res.status(500).json({ message: 'Error al cambiar contraseña' });
  }
};

// 3. REGISTRO DE ADMIN

export const registrarAdmin = async (req: Request, res: Response): Promise<void> => {
    try {
        const { nombre, email, password } = req.body;
        const usuario = await Usuario.create({
            nombre, email, password, rol: 'ADMIN', mustChangePassword: false, activo: true
        });
        res.status(201).json({ message: 'Admin creado', usuario });
    } catch (error) {
        res.status(500).json({ message: 'Error creando admin', error });
    }
}