import express from 'express';
import cors from 'cors';
import db from './config/db';

// Importar Modelos
import './models/Propietario'; 
import './models/Cliente';
import './models/Propiedad';
import './models/Interes';
import './models/Operacion';
import './models/Visita';
import './models/Seguimiento';
import './models/Usuario';

// Importar Clases para Relaciones
import Propietario from './models/Propietario'; 
import Propiedad from './models/Propiedad'; 
import Cliente from './models/Cliente'; 
import Interes from './models/Interes';
import Operacion from './models/Operacion';
import Visita from './models/Visita';
import Seguimiento from './models/Seguimiento';

// Importar Rutas
import authRoutes from './routes/authRoutes';
import propietarioRoutes from './routes/propietarioRoutes';
import propiedadRoutes from './routes/propiedadRoutes';
import clienteRoutes from './routes/clienteRoutes';
import interesRoutes from './routes/interesRoutes';
import operacionRoutes from './routes/operacionRoutes';
import visitaRoutes from './routes/visitaRoutes';
import seguimientoRoutes from './routes/seguimientoRoutes';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// --- RELACIONES ---

// 1. Propietarios <-> Propiedades (Muchos a Muchos)
Propiedad.belongsToMany(Propietario, { through: 'PropiedadPropietario' });
Propietario.belongsToMany(Propiedad, { through: 'PropiedadPropietario' });

// 2. Interesados
Interes.belongsTo(Cliente, { foreignKey: 'clienteId' });
Interes.belongsTo(Propiedad, { foreignKey: 'propiedadId' });
Cliente.hasMany(Interes, { foreignKey: 'clienteId' });
Propiedad.hasMany(Interes, { foreignKey: 'propiedadId' });

// 3. Operaciones
Operacion.belongsTo(Propiedad, { foreignKey: 'propiedadId' });
Operacion.belongsTo(Cliente, { foreignKey: 'clienteId' });
Propiedad.hasMany(Operacion, { foreignKey: 'propiedadId' });

// 4. Visitas
Visita.belongsTo(Cliente, { foreignKey: 'clienteId' });
Cliente.hasMany(Visita, { foreignKey: 'clienteId' });
Visita.belongsTo(Propiedad, { foreignKey: 'propiedadId' });
Propiedad.hasMany(Visita, { foreignKey: 'propiedadId' });

// 5. Seguimiento
Seguimiento.belongsTo(Cliente, { foreignKey: 'clienteId' });
Seguimiento.belongsTo(Propiedad, { foreignKey: 'propiedadId' });

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/propietarios', propietarioRoutes);
app.use('/api/propiedades', propiedadRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/intereses', interesRoutes);
app.use('/api/operaciones', operacionRoutes);
app.use('/api/visitas', visitaRoutes);
app.use('/api/seguimientos', seguimientoRoutes);

app.get('/', (req, res) => {
  res.send('¡API de Sillar Inmobiliaria funcionando! 🏠');
});

const PORT = process.env.PORT || 4000;

const startServer = async () => {
  try {
    await db.authenticate();
    console.log('✅ Conexión a la base de datos exitosa.');
    
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