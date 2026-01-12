import { DataTypes, Model } from 'sequelize';
import db from '../config/db';

class Requerimiento extends Model {}

Requerimiento.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    fecha: {
      type: DataTypes.DATEONLY, // Solo fecha
      allowNull: false,
    },
    pedido: {
      type: DataTypes.TEXT, // "Busca casa de 3 pisos..."
      allowNull: false,
    },
    prioridad: {
      type: DataTypes.STRING, // "URGENTE" | "NORMAL"
      defaultValue: 'NORMAL',
    },
    estado: {
      type: DataTypes.STRING, // "ABIERTO" | "ATENDIDO" | "DESCARTADO"
      defaultValue: 'ABIERTO',
    },
    clienteId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    usuarioId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  },
  {
    sequelize: db,
    modelName: 'Requerimiento',
    tableName: 'requerimientos',
  }
);

export default Requerimiento;