import { DataTypes, Model } from 'sequelize';
import db from '../config/db';

class Agente extends Model {
    public id!: string;
    public nombre!: string;
    public inmobiliaria!: string;
    public celular1!: string;
    public celular2!: string;
    public celular3!: string;
    public datosAdicionales!: string;
    public estado!: 'ALIADO' | 'OBSERVADO'; // ALIADO = Bien, OBSERVADO = Cuidado
}

Agente.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    inmobiliaria: {
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
    celular3: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    datosAdicionales: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    estado: {
        type: DataTypes.ENUM('ALIADO', 'OBSERVADO'),
        defaultValue: 'ALIADO',
    }
}, {
    sequelize: db,
    modelName: 'Agente',
    tableName: 'agentes',
});

export default Agente;