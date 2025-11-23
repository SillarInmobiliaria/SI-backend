import { DataTypes, Model } from 'sequelize';
import db from '../config/db';

class Visita extends Model {}

Visita.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    asesor: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    hora: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    resultado: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    comentario: {
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
    modelName: 'Visita',
    tableName: 'visitas',
  }
);

export default Visita;