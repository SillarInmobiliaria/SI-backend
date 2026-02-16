import { DataTypes, Model } from 'sequelize';
import db from '../config/db';

class Feedback extends Model {
  public id!: string;
  public tipo!: string;
  public asunto!: string;
  public descripcion!: string;
  public usuarioId!: string;
  public estado!: string;
}

Feedback.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  tipo: {
    type: DataTypes.ENUM('IDEA', 'BUG', 'SUGERENCIA'),
    allowNull: false,
  },
  asunto: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  usuarioId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  estado: {
    type: DataTypes.STRING,
    defaultValue: 'PENDIENTE',
  }
}, {
  sequelize: db,
  tableName: 'feedbacks',
  timestamps: true,
});

export default Feedback;