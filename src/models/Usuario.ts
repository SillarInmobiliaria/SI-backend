import { DataTypes, Model } from 'sequelize';
import db from '../config/db';
import bcrypt from 'bcryptjs';

class Usuario extends Model {
  password(password: any, password1: any) {
    throw new Error('Method not implemented.');
  }
  nombre: any;
  id: any;
  mustChangePassword: any;
  email: any;
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
  motivoSuspension: {
    type: DataTypes.STRING,
    allowNull: true,
  }
}, {
  sequelize: db,
  modelName: 'Usuario',
  tableName: 'usuarios',
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