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
      allowNull: false,
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
    email: { // También es útil tener el correo del dueño
      type: DataTypes.STRING,
      allowNull: true,
    }
  },
  {
    sequelize: db,
    modelName: 'Propietario',
    tableName: 'propietarios', // Así se llamará en Postgres
  }
);

export default Propietario;