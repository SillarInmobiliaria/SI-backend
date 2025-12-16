import { DataTypes, Model } from 'sequelize';
import db from '../config/db';

class Interes extends Model {
  nota: any;
}

Interes.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    estado: {
      type: DataTypes.STRING,
      defaultValue: 'Pendiente',
    },
    nota: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    clienteId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    propiedadId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    modelName: 'Interes',
    tableName: 'intereses',
  }
);

export default Interes;