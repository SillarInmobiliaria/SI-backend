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
      type: DataTypes.STRING(8),
      allowNull: false,
      unique: true,
    },
    fechaNacimiento: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    direccion: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    celular1: {
      type: DataTypes.STRING(9),
      allowNull: false,
    },
    celular2: {
      type: DataTypes.STRING(9),
      allowNull: true,
    },
    asesor: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fechaAlta: {
      type: DataTypes.DATEONLY,
      allowNull: true,
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
    usuarioId: {
    type: DataTypes.UUID,
    allowNull: true,
    }
  },
  {
    sequelize: db,
    modelName: 'Propietario',
    tableName: 'propietarios',
  }
);

export default Propietario;