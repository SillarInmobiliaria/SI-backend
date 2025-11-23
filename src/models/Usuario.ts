import { DataTypes, Model } from 'sequelize';
import db from '../config/db';
import bcrypt from 'bcryptjs'; // Para encriptar

class Usuario extends Model {
  // Método para verificar si la contraseña es correcta
  public async compararPassword(password: string): Promise<boolean> {
    // @ts-ignore
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
      unique: true, // No puede haber dos correos iguales
      validate: {
        isEmail: true,
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rol: { // 'admin' o 'asesor'
      type: DataTypes.STRING,
      defaultValue: 'asesor',
    }
  },
  {
    sequelize: db,
    modelName: 'Usuario',
    tableName: 'usuarios',
    hooks: {
      // Antes de guardar, encriptamos la contraseña automáticamente
      beforeCreate: async (usuario: any) => {
        const salt = await bcrypt.genSalt(10);
        usuario.password = await bcrypt.hash(usuario.password, salt);
      },
    }
  }
);

export default Usuario;