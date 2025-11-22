import { DataTypes, Model } from 'sequelize';
import db from '../config/db';

class Propiedad extends Model {}

Propiedad.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    direccion: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    tipo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    area: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    areaConstruida: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    propietarioId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    modelName: 'Propiedad',
    tableName: 'propiedades',
  }
);

export default Propiedad;