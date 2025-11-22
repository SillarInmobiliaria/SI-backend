import express from 'express';
import cors from 'cors';
import db from './config/db';

// Importar Modelos
import './models/Propietario'; 
import './models/Cliente';
import './models/Propiedad';
import './models/Interes';

import Propietario from './models/Propietario'; 
import Propiedad from './models/Propiedad'; 
import Cliente from './models/Cliente'; 
import Interes from './models/Interes';

// Importar Rutas
import propietarioRoutes from './routes/propietarioRoutes';
import propiedadRoutes from './routes/propiedadRoutes';
import clienteRoutes from './routes/clienteRoutes';
import interesRoutes from './routes/interesRoutes';

const app = express();

app.use(cors());
app.use(express.json());

// --- RELACIONES ---
Propietario.hasMany(Propiedad, { foreignKey: 'propietarioId' });
Propiedad.belongsTo(Propietario, { foreignKey: 'propietarioId' });

// Relaciones de Interés (El puente)
Interes.belongsTo(Cliente, { foreignKey: 'clienteId' });
Interes.belongsTo(Propiedad, { foreignKey: 'propiedadId' });
Cliente.hasMany(Interes, { foreignKey: 'clienteId' });   // Un cliente puede tener muchos intereses
Propiedad.hasMany(Interes, { foreignKey: 'propiedadId' }); // Una casa puede tener muchos interesados


// Usar Rutas
app.use('/api/propietarios', propietarioRoutes);
app.use('/api/propiedades', propiedadRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/intereses', interesRoutes);

app.get('/', (req, res) => {
  res.send('¡API de Sillar Inmobiliaria funcionando! 🏠');
});

const PORT = process.env.PORT || 4000;

const startServer = async () => {
  try {
    await db.authenticate();
    console.log('✅ Conexión a la base de datos exitosa.');
    await db.sync({ alter: true }); 
    console.log('✅ Todas las tablas sincronizadas (incluido Intereses).');

    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar:', error);
  }
};

startServer();