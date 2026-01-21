import { DataTypes, Model } from 'sequelize';
import db from '../config/db';

class Cartera extends Model {
    public id!: number;
    public nombreCompleto!: string;
    public documento!: string;
    public telefono!: string;
    public telefono2!: string;
    public email!: string;
    public direccion!: string;
    public fechaNacimiento!: string;
    public profesion!: string;
    public fechaRegistro!: string;
    public tipo!: string;
    public estado!: string;
}

Cartera.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nombreCompleto: { type: DataTypes.STRING, allowNull: false },
    documento: { type: DataTypes.STRING, allowNull: true }, 
    telefono: { type: DataTypes.STRING, allowNull: false },
    telefono2: { type: DataTypes.STRING, allowNull: true },
    email: { type: DataTypes.STRING, allowNull: true },
    direccion: { type: DataTypes.STRING, allowNull: true },
    fechaNacimiento: { type: DataTypes.DATEONLY, allowNull: true },
    profesion: { type: DataTypes.STRING, allowNull: true },
    fechaRegistro: { type: DataTypes.DATEONLY, defaultValue: DataTypes.NOW },
    tipo: { type: DataTypes.ENUM('INQUILINO', 'COMPRADOR'), defaultValue: 'INQUILINO' },
    estado: { type: DataTypes.ENUM('ACTIVO', 'FINALIZADO'), defaultValue: 'ACTIVO' }
}, {
    sequelize: db,
    modelName: 'Cartera',
    tableName: 'cartera_clientes'
});

export default Cartera;