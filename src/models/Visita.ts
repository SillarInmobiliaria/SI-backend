import { Model, DataTypes } from 'sequelize';
import db from '../config/db';

class Visita extends Model {
    public id!: string;
    public fechaProgramada!: Date;
    public estado!: string;
    public comentariosPrevios!: string;
    public resultadoSeguimiento!: string;
    
    public clienteId!: string;
    public propiedadId!: string;
    public asesorId!: string;
}

Visita.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    fechaProgramada: {
        type: DataTypes.DATE,
        allowNull: false
    },
    estado: {
        type: DataTypes.STRING, 
        defaultValue: 'PENDIENTE'
    },
    comentariosPrevios: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    resultadoSeguimiento: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    clienteId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    propiedadId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    asesorId: {
        type: DataTypes.UUID,
        allowNull: false
    }
}, {
    sequelize: db,
    tableName: 'visitas',
    timestamps: true
});


export default Visita;