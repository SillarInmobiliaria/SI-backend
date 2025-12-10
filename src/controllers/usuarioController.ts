import { Request, Response } from 'express';
import Usuario from '../models/Usuario';

// Función para generar contraseña aleatoria (8 caracteres)
const generarPasswordTemporal = () => {
  return Math.random().toString(36).slice(-8); // Ej: "x7z9q1w2"
};

// Crear Usuario (Solo accesible por ADMIN)
export const crearUsuario = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nombre, email, rol } = req.body;

    // Validar rol
    if (!['ADMIN', 'ASESOR'].includes(rol)) {
        res.status(400).json({ message: 'Rol inválido. Debe ser ADMIN o ASESOR.' });
        return;
    }

    // Verificar si ya existe
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
      password: passwordTemporal, // Se encriptará auto en el modelo
      rol,
      mustChangePassword: true, // Obligar a cambiarla
      activo: true
    });

    // RESPUESTA AL ADMIN: Le damos la contraseña temporal para que se la pase al asesor
    res.status(201).json({ 
      message: 'Usuario creado con éxito.',
      credenciales: {
        nombre: nuevoUsuario.nombre,
        email: nuevoUsuario.email,
        passwordTemporal: passwordTemporal, // <--- IMPORTANTE: Anotar esto
        rol: (nuevoUsuario as any).rol
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear usuario.' });
  }
};

// Obtener lista de usuarios
export const obtenerUsuarios = async (req: Request, res: Response) => {
    try {
        const usuarios = await Usuario.findAll({
            attributes: ['id', 'nombre', 'email', 'rol', 'activo', 'createdAt'] // Sin password
        });
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener usuarios' });
    }
};