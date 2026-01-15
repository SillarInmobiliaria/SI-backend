import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './config/db';
import bcrypt from 'bcryptjs'; 
import dashboardRoutes from './routes/dashboardRoutes';

// Importar Modelos
import './models/Propietario'; 
import './models/Cliente';
import './models/Propiedad';
import './models/Interes';
import './models/Operacion';
import './models/Visita';
import './models/Seguimiento';
import Usuario from './models/Usuario'; 
import './models/SolicitudPermiso';
import './models/Notificacion';
import './models/Requerimiento'; 

import { definirAsociaciones } from './models/Asociaciones';

// Importar Rutas
import authRoutes from './routes/authRoutes';
import usuarioRoutes from './routes/usuarioRoutes';
import propietarioRoutes from './routes/propietarioRoutes';
import propiedadRoutes from './routes/propiedadRoutes';
import clienteRoutes from './routes/clienteRoutes';
import interesRoutes from './routes/interesRoutes';
import operacionRoutes from './routes/operacionRoutes';
import visitaRoutes from './routes/visitaRoutes';
import seguimientoRoutes from './routes/seguimientoRoutes';
import cumpleanosRoutes from './routes/cumpleanosRoutes';
import requerimientoRoutes from './routes/requerimientoRoutes';
import agenteRoutes from './routes/agenteRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/propietarios', propietarioRoutes);
app.use('/api/propiedades', propiedadRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/intereses', interesRoutes);
app.use('/api/operaciones', operacionRoutes);
app.use('/api/visitas', visitaRoutes);
app.use('/api/seguimientos', seguimientoRoutes);
app.use('/api/admin/dashboard', dashboardRoutes);
app.use('/api/admin/cumpleanos', cumpleanosRoutes);
app.use('/api/requerimientos', requerimientoRoutes);
app.use('/api/agentes', agenteRoutes);

// --- FUNCIÓN DE EMERGENCIA ---
const crearUsuariosPorDefecto = async () => {
    try {
        console.log('🔄 Verificando acceso de Administrador...');
        const emailAdmin = 'admin@sillar.com';
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('123456', salt);

        let admin = await Usuario.findOne({ where: { email: emailAdmin } });
        
        if (!admin) {
            console.log('⚡ Usuario no existe. Creando ADMIN nuevo...');
            await Usuario.create({
                nombre: 'Administrador Sillar',
                email: emailAdmin,
                password: hashedPassword,
                rol: 'ADMIN',
                celular: '999999999',
                activo: true,
                mustChangePassword: false
            });
        } else {
            console.log('⚠️ El Admin ya existe. FORZANDO contraseña a 123456...');
            await Usuario.update(
                { password: hashedPassword, activo: true },
                { where: { email: emailAdmin } }
            );
        }
        console.log('✅ ACCESO GARANTIZADO: admin@sillar.com / 123456');
    } catch (error) {
        console.error('Error gestionando usuarios:', error);
    }
};

const conectarDB = async () => {
    try {
        await db.authenticate();
        console.log('✅ Base de Datos Conectada.');
        
        definirAsociaciones();
        console.log('✅ Relaciones (Asociaciones) establecidas.');

        await db.sync({ alter: true }); 
        console.log('✅ Tablas Sincronizadas.');

        await crearUsuariosPorDefecto(); 

    } catch (error) {
        console.error('❌ Error conexión BD:', error);
    }
};

conectarDB();

app.listen(PORT, () => {
    console.log(`🚀 Servidor en http://localhost:${PORT}`);
});