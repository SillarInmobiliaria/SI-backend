import { DataTypes, Model } from 'sequelize';
import db from '../config/db';

class Notificacion extends Model {}

Notificacion.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  mensaje: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tipo: { // 'ALERTA', 'INFO', 'SISTEMA'
    type: DataTypes.STRING,
    defaultValue: 'INFO'
  },
  leido: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  // Opcional: ID del usuario afectado
  usuarioAfectadoId: {
    type: DataTypes.STRING,
    allowNull: true,
  }
}, {
  sequelize: db,
  modelName: 'Notificacion',
  tableName: 'notificaciones',
});

export default Notificacion;