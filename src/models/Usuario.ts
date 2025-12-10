import { DataTypes, Model } from 'sequelize';
import db from '../config/db';
import bcrypt from 'bcryptjs';

class Usuario extends Model {
  public id!: string;
  public password!: string;
  public mustChangePassword!: boolean;
  nombre: any;
  email: any;
  
  // Método para verificar contraseña
  public async compararPassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }
}

Usuario.init(
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
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rol: {
      type: DataTypes.ENUM('ADMIN', 'ASESOR'), // ADMIN = CEO, ASESOR = Empleado
      defaultValue: 'ASESOR',
      allowNull: false,
    },
    mustChangePassword: { // ¿Debe cambiar la contraseña? (True para nuevos usuarios)
      type: DataTypes.BOOLEAN,
      defaultValue: true, 
    },
    activo: { // Para desactivar asesores sin borrarlos
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    }
  },
  {
    sequelize: db,
    modelName: 'Usuario',
    tableName: 'usuarios',
    hooks: {
      beforeCreate: async (usuario: Usuario) => {
        const salt = await bcrypt.genSalt(10);
        usuario.password = await bcrypt.hash(usuario.password, salt);
      },
      beforeUpdate: async (usuario: Usuario) => {
        if (usuario.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          usuario.password = await bcrypt.hash(usuario.password, salt);
        }
      }
    }
  }
);

export default Usuario;