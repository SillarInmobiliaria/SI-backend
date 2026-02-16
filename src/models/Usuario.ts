import { DataTypes, Model } from 'sequelize';
import db from '../config/db';
import bcrypt from 'bcryptjs';

class Usuario extends Model {
  public id!: string;
  public nombre!: string;
  public email!: string;
  public password!: string;
  public rol!: string;
  public activo!: boolean;
  public mustChangePassword!: boolean;
  public motivoSuspension!: string | null;
  public passwordChanged!: boolean;
  public createdAt!: Date;
  public updatedAt!: Date;
}

Usuario.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  rol: {
    type: DataTypes.ENUM('ADMIN', 'ASESOR'),
    defaultValue: 'ASESOR',
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  mustChangePassword: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  passwordChanged: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  motivoSuspension: {
    type: DataTypes.STRING,
    allowNull: true,
  }
}, {
  sequelize: db,
  modelName: 'Usuario',
  tableName: 'usuarios',
  timestamps: true,
  hooks: {
    beforeCreate: async (usuario: any) => {
      if (usuario.password) {
        const salt = await bcrypt.genSalt(10);
        usuario.password = await bcrypt.hash(usuario.password, salt);
      }
    },
    beforeUpdate: async (usuario: any) => {
      if (usuario.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        usuario.password = await bcrypt.hash(usuario.password, salt);
      }
    },
  },
});

export default Usuario;