import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const db = new Sequelize(
    process.env.DB_NAME || 'sillar_db',      // Nombre de tu base de datos
    process.env.DB_USER || 'postgres',       // Tu usuario (usualmente postgres)
    process.env.DB_PASS || 'admin1234',      // 👈 PON TU CONTRASEÑA DE PGADMIN AQUÍ
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'postgres',
        logging: false, // Pon true si quieres ver las consultas SQL en la consola
        port: 5432,
    }
);

export default db;