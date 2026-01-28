import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const db = new Sequelize(
    process.env.DB_NAME || 'sillar_db',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASS || 'admin1234',
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'postgres',
        logging: false,
        port: 5432,
    }
);

export default db;