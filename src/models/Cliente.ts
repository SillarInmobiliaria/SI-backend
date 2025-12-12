import { DataTypes, Model } from 'sequelize';
import db from '../config/db';

class Cliente extends Model {}

Cliente.init(
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
    telefono1: {
      type: DataTypes.STRING,
      allowNull: false, // Obligatorio
    },
    telefono2: {
      type: DataTypes.STRING,
      allowNull: true, // Opcional
    },
    estadoCivil: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ocupacion: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fechaAlta: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
    },
    usuarioId: {
    type: DataTypes.UUID, // O STRING, según uses en Usuario
    allowNull: true, // Lo dejamos true por ahora para no romper datos viejos
    }
  },
  {
    sequelize: db,
    modelName: 'Cliente',
    tableName: 'clientes',
  }
);

export default Cliente;