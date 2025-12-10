import express from 'express';
import cors from 'cors';
import db from './config/db';

// -----------------------------------------
// 1. IMPORTAR MODELOS (Para que Sequelize cree las tablas)
// -----------------------------------------
import './models/Propietario'; 
import './models/Cliente';
import './models/Propiedad';
import './models/Interes';
import './models/Operacion';
import './models/Visita';
import './models/Seguimiento';
import './models/Usuario';
import './models/SolicitudPermiso';

// -----------------------------------------
// 2. IMPORTAR CLASES (Para definir las relaciones)
// -----------------------------------------
import Propietario from './models/Propietario'; 
import Propiedad from './models/Propiedad'; 
import Cliente from './models/Cliente'; 
import Interes from './models/Interes';
import Operacion from './models/Operacion';
import Visita from './models/Visita';
import Seguimiento from './models/Seguimiento';
import Usuario from './models/Usuario';
import SolicitudPermiso from './models/SolicitudPermiso';

// -----------------------------------------
// 3. IMPORTAR RUTAS
// -----------------------------------------
import authRoutes from './routes/authRoutes';
import usuarioRoutes from './routes/usuarioRoutes'; // 👈 ¡CRUCIAL para crear usuarios!
import propietarioRoutes from './routes/propietarioRoutes';
import propiedadRoutes from './routes/propiedadRoutes';
import clienteRoutes from './routes/clienteRoutes';
import interesRoutes from './routes/interesRoutes';
import operacionRoutes from './routes/operacionRoutes';
import visitaRoutes from './routes/visitaRoutes';
import seguimientoRoutes from './routes/seguimientoRoutes';

const app = express();

// Configuración básica
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// -----------------------------------------
// 4. DEFINIR RELACIONES ENTRE TABLAS
// -----------------------------------------

// Propietarios <-> Propiedades (Muchos a Muchos)
Propiedad.belongsToMany(Propietario, { through: 'PropiedadPropietario' });
Propietario.belongsToMany(Propiedad, { through: 'PropiedadPropietario' });

// Interesados (Cliente se interesa en Propiedad)
Interes.belongsTo(Cliente, { foreignKey: 'clienteId' });
Interes.belongsTo(Propiedad, { foreignKey: 'propiedadId' });
Cliente.hasMany(Interes, { foreignKey: 'clienteId' });
Propiedad.hasMany(Interes, { foreignKey: 'propiedadId' });

// Operaciones (Ventas/Alquileres)
Operacion.belongsTo(Propiedad, { foreignKey: 'propiedadId' });
Operacion.belongsTo(Cliente, { foreignKey: 'clienteId' });
Propiedad.hasMany(Operacion, { foreignKey: 'propiedadId' });

// Visitas Físicas
Visita.belongsTo(Cliente, { foreignKey: 'clienteId' });
Cliente.hasMany(Visita, { foreignKey: 'clienteId' });
Visita.belongsTo(Propiedad, { foreignKey: 'propiedadId' });
Propiedad.hasMany(Visita, { foreignKey: 'propiedadId' });

// Seguimiento (Llamadas, mensajes)
Seguimiento.belongsTo(Cliente, { foreignKey: 'clienteId' });
Seguimiento.belongsTo(Propiedad, { foreignKey: 'propiedadId' });

// Sistema de Permisos y Usuarios
// Un Usuario (Asesor) hace solicitudes
Usuario.hasMany(SolicitudPermiso, { foreignKey: 'usuarioId', as: 'solicitudes' });
SolicitudPermiso.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'solicitante' });

// Un Usuario (Admin) aprueba solicitudes
Usuario.hasMany(SolicitudPermiso, { foreignKey: 'adminId', as: 'aprobaciones' });
SolicitudPermiso.belongsTo(Usuario, { foreignKey: 'adminId', as: 'aprobador' });

// -----------------------------------------
// 5. CONFIGURAR RUTAS (Endpoints)
// -----------------------------------------
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes); // 👈 Aquí habilitamos la URL /api/usuarios
app.use('/api/propietarios', propietarioRoutes);
app.use('/api/propiedades', propiedadRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/intereses', interesRoutes);
app.use('/api/operaciones', operacionRoutes);
app.use('/api/visitas', visitaRoutes);
app.use('/api/seguimientos', seguimientoRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('¡API de Sillar Inmobiliaria funcionando! 🏠');
});

const PORT = process.env.PORT || 4000;

// -----------------------------------------
// 6. INICIAR SERVIDOR
// -----------------------------------------
const startServer = async () => {
  try {
    await db.authenticate();
    console.log('✅ Conexión a la base de datos exitosa.');
    
    // alter: true actualiza las tablas si agregas campos nuevos sin borrar la data
    await db.sync({ alter: true }); 
    console.log('✅ Todas las tablas sincronizadas correctamente.');

    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar:', error);
  }
};

startServer();