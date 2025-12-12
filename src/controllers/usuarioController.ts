import { Request, Response } from 'express';
import Usuario from '../models/Usuario';
import Notificacion from '../models/Notificacion';

// Función auxiliar para generar contraseña aleatoria (8 caracteres)
const generarPasswordTemporal = () => {
  return Math.random().toString(36).slice(-8); // Ej: "x7z9q1w2"
};

// 1. CREAR USUARIO (Solo Admin)

export const createUsuario = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nombre, email, rol } = req.body;

    // Validar rol permitido
    if (!['ADMIN', 'ASESOR'].includes(rol)) {
        res.status(400).json({ message: 'Rol inválido. Debe ser ADMIN o ASESOR.' });
        return;
    }

    // Verificar si el correo ya existe
    const existe = await Usuario.findOne({ where: { email } });
    if (existe) {
        res.status(400).json({ message: 'El correo ya está registrado.' });
        return;
    }

    // Generar contraseña temporal
    const passwordTemporal = generarPasswordTemporal();

    const nuevoUsuario = await Usuario.create({
      nombre,
      email,
      password: passwordTemporal, // El modelo la encriptará automáticamente
      rol,
      mustChangePassword: true, // Obligamos a que la cambie
      activo: true
    });

    // RESPUESTA: Devolvemos la contraseña temporal para que el Admin se la entregue al usuario
    res.status(201).json({ 
      message: 'Usuario creado con éxito.',
      credenciales: {
        nombre: nuevoUsuario.nombre,
        email: nuevoUsuario.email,
        passwordTemporal: passwordTemporal, // <--- IMPORTANTE: Mostrar esto en el frontend
        rol: (nuevoUsuario as any).rol
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear usuario.' });
  }
};

// 2. OBTENER LISTA DE USUARIOS (Ordenada A-Z)

export const getUsuarios = async (req: Request, res: Response) => {
    try {
        const usuarios = await Usuario.findAll({
            // Traemos solo lo necesario (sin password) + el motivo de suspensión
            attributes: ['id', 'nombre', 'email', 'rol', 'activo', 'createdAt', 'motivoSuspension'],
            order: [['nombre', 'ASC']] // 👈 Orden Alfabético
        });
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener usuarios' });
    }
};

// 3. SUSPENDER / REACTIVAR (Con Motivo)

export const toggleEstadoUsuario = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { activo, motivo } = req.body; // Recibimos el nuevo estado y el motivo (opcional)

    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
      res.status(404).json({ message: 'Usuario no encontrado' });
      return;
    }

    // Actualizamos estado
    // @ts-ignore
    usuario.activo = activo;
    
    // Si estamos DESACTIVANDO (activo = false), guardamos el motivo.
    // Si estamos REACTIVANDO (activo = true), limpiamos el motivo (null).
    // @ts-ignore
    usuario.motivoSuspension = activo ? null : (motivo || 'Suspensión administrativa sin detalle');

    await usuario.save();

    res.json({ 
      message: `Usuario ${activo ? 'ACTIVADO' : 'SUSPENDIDO'} correctamente`, 
      usuario 
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al cambiar estado del usuario' });
  }
};

// 4. ELIMINAR USUARIO (Acción Definitiva)

export const deleteUsuario = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
      res.status(404).json({ message: 'Usuario no encontrado' });
      return;
    }

    await usuario.destroy(); // Borrado físico de la base de datos
    res.json({ message: 'Usuario eliminado correctamente' });

  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar usuario' });
  }
};

// 5. OBTENER NOTIFICACIONES DEL SISTEMA

export const getNotificaciones = async (req: Request, res: Response): Promise<void> => {
    try {
        // Traemos las alertas ordenadas por fecha (las nuevas primero)
        const notificaciones = await Notificacion.findAll({ 
            order: [['createdAt', 'DESC']],
            limit: 50 // Opcional: limitar para no traer miles
        });
        res.json(notificaciones);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener notificaciones' });
    }
};