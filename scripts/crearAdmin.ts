import db from '../src/config/db';
import Usuario from '../src/models/Usuario';

const crearAdminMaestro = async () => {
  try {
    await db.authenticate();
    console.log('🔄 Conectando a la BD...');

    // 👇 AQUÍ ESTÁ EL TRUCO: Usamos { force: true } SOLO para Usuario.
    // Esto borra la tabla 'usuarios' vieja (con el error del rol) y crea la nueva limpia.
    await Usuario.sync({ force: true }); 
    console.log('✅ Tabla Usuarios recreada correctamente.');

    const email = 'mijael@sillar.com'; // Tu correo
    const password = 'admin123'; // Tu contraseña

    const nuevoAdmin = await Usuario.create({
      nombre: 'Mijael Juy',
      email: email,
      password: password, // El modelo la encriptará automáticamente
      rol: 'ADMIN',
      mustChangePassword: false,
      activo: true
    });

    console.log('=============================================');
    console.log('🚀 USUARIO ADMIN CREADO EXITOSAMENTE');
    console.log('=============================================');
    console.log(`👤 Nombre: ${nuevoAdmin.nombre}`);
    console.log(`📧 Correo: ${email}`);
    console.log(`🔑 Contraseña: ${password}`);
    console.log('=============================================');

  } catch (error) {
    console.error('❌ Error al crear admin:', error);
  } finally {
    // Cerramos la conexión para que el script termine
    await db.close(); 
    process.exit();
  }
};

crearAdminMaestro();