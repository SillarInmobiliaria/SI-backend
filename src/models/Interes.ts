import { DataTypes, Model } from 'sequelize';
import db from '../config/db';

class Interes extends Model {}

Interes.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    estado: {
      type: DataTypes.STRING,
      defaultValue: 'Pendiente', // Por defecto, el interés es nuevo
    },
    nota: {
      type: DataTypes.TEXT, // Por si quieres anotar "Llamar por la tarde"
      allowNull: true,
    },
    // Relación con Cliente
    clienteId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    // Relación con Propiedad
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