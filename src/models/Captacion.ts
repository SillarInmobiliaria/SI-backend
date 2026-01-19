import { DataTypes, Model } from 'sequelize';
import db from '../config/db';

class Captacion extends Model {
    public id!: string;
    public fechaCaptacion!: string;
    public fuente!: string;
    public inmueble!: string;
    public tipoOperacion!: string;
    public relacion!: string;
    public nombre!: string;
    public celular1!: string;
    public celular2!: string;
    public ubicacion!: string;
    public distrito!: string;
    public moneda!: 'USD' | 'PEN';
    public precio!: number;
    public at!: number;
    public ac!: number;
    public precioM2!: number;
    public caracteristicas!: string;
    public antiguedad!: string;
    public situacion!: string;
    public observaciones!: string;
}

Captacion.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    fechaCaptacion: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW,
    },
    fuente: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    inmueble: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    tipoOperacion: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    relacion: {
        type: DataTypes.ENUM('PROPIETARIO', 'AGENTE', 'INMOBILIARIA', 'CONSTRUCTORA'),
        defaultValue: 'PROPIETARIO',
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    celular1: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    celular2: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    ubicacion: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    distrito: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    moneda: {
        type: DataTypes.ENUM('USD', 'PEN'),
        defaultValue: 'USD',
    },
    precio: {
        type: DataTypes.DECIMAL(20, 2),
        defaultValue: 0,
    },
    at: {
        type: DataTypes.DECIMAL(20, 2),
        defaultValue: 0,
    },
    ac: {
        type: DataTypes.DECIMAL(20, 2),
        defaultValue: 0,
    },
    precioM2: {
        type: DataTypes.DECIMAL(20, 2),
        defaultValue: 0,
    },
    caracteristicas: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    antiguedad: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    situacion: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    observaciones: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    sequelize: db,
    modelName: 'Captacion',
    tableName: 'captaciones',
});

export default Captacion;