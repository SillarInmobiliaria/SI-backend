import { Model, DataTypes } from 'sequelize';
import db from '../config/db';
import Usuario from './Usuario';
import Propiedad from './Propiedad';
import Cliente from './Cliente'; // 👈 IMPORTANTE: Importar Cliente

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

// --- CORRECCIÓN DE RELACIONES ---
// El cliente es un Cliente, no un Usuario
Visita.belongsTo(Cliente, { foreignKey: 'clienteId', as: 'cliente' }); 
Visita.belongsTo(Usuario, { foreignKey: 'asesorId', as: 'asesor' });
Visita.belongsTo(Propiedad, { foreignKey: 'propiedadId', as: 'propiedad' });

export default Visita;