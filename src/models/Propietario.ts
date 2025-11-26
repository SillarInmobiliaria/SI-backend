import { DataTypes, Model } from 'sequelize';
import db from '../config/db';

class Propietario extends Model {}

Propietario.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dni: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    fechaNacimiento: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    direccion: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    celular1: {
      type: DataTypes.STRING,
      allowNull: false, // Obligatorio
    },
    celular2: {
      type: DataTypes.STRING,
      allowNull: true, // Opcional
    },
    asesor: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fechaAlta: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
    },
    detalles: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    banco: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cuenta: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cci: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize: db,
    modelName: 'Propietario',
    tableName: 'propietarios',
  }
);

export default Propietario;