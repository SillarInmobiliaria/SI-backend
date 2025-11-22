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
      unique: true, // No puede haber dos propietarios con el mismo DNI
    },
    fechaNacimiento: {
      type: DataTypes.DATEONLY, // Solo nos interesa la fecha
      allowNull: false,
    },
    direccion: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    modelName: 'Propietario',
    tableName: 'propietarios', // Así se llamará en Postgres
  }
);

export default Propietario;