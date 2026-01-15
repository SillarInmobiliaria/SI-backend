import { DataTypes, Model } from 'sequelize';
import db from '../config/db';

class Captacion extends Model {
    public id!: string;
    public fechaCaptacion!: Date;
    public fuente!: string;
    public inmueble!: string;
    public tipoOperacion!: string;
    public relacion!: string;
    public nombre!: string;
    public celular1!: string;
    public celular2!: string;
    public ubicacion!: string;
    public distrito!: string;
    public moneda!: string; 
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
        allowNull: true,
    },
    fuente: {
        // CORREGIDO: 'LETRERO' en singular para coincidir con tu Excel y Frontend
        type: DataTypes.ENUM('GRUPOS', 'LETRERO', 'PERIODICO', 'OTROS'),
        defaultValue: 'OTROS',
    },
    inmueble: {
        type: DataTypes.ENUM('CASA', 'CASA_TERRENO', 'DEPARTAMENTO', 'PENTHOUSE', 'DUPLEX', 'LOCAL_COMERCIAL', 'TERRENO', 'TERRENO_AGRICOLA', 'TERRENO_INDUSTRIAL', 'OTROS'),
        defaultValue: 'CASA',
    },
    tipoOperacion: {
        type: DataTypes.ENUM('VENTA', 'ALQUILER', 'ANTICRESIS', 'VENTA_ALQUILER'),
        defaultValue: 'VENTA',
    },
    relacion: {
        type: DataTypes.ENUM('PROPIETARIO', 'AGENTE', 'INMOBILIARIA', 'CONSTRUCTORA'),
        defaultValue: 'PROPIETARIO',
    },
    nombre: { type: DataTypes.STRING, allowNull: true },
    celular1: { type: DataTypes.STRING, allowNull: true },
    celular2: { type: DataTypes.STRING, allowNull: true },
    ubicacion: { type: DataTypes.STRING, allowNull: true },
    distrito: { type: DataTypes.STRING, allowNull: true },
    
    // CAMPO MONEDA
    moneda: {
        type: DataTypes.ENUM('USD', 'PEN'),
        defaultValue: 'USD',
    },

    precio: { type: DataTypes.DECIMAL(12, 2), allowNull: true },
    at: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    ac: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    precioM2: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    
    caracteristicas: { type: DataTypes.TEXT, allowNull: true },
    antiguedad: { type: DataTypes.STRING, allowNull: true },
    
    // SITUACIÓN como TEXT para que escribas bastante
    situacion: { type: DataTypes.TEXT, allowNull: true }, 
    
    observaciones: { type: DataTypes.TEXT, allowNull: true },
}, {
    sequelize: db,
    modelName: 'Captacion',
    tableName: 'captaciones',
});

export default Captacion;