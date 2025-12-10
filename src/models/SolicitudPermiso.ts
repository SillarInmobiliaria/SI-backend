import { DataTypes, Model } from 'sequelize';
import db from '../config/db';

class SolicitudPermiso extends Model {}

SolicitudPermiso.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    usuarioId: { // El asesor que pide permiso
      type: DataTypes.UUID,
      allowNull: false,
    },
    tipoAccion: {
      type: DataTypes.ENUM('EDITAR', 'ELIMINAR'),
      allowNull: false,
    },
    entidadTipo: {
      type: DataTypes.ENUM('PROPIEDAD', 'CLIENTE', 'PROPIETARIO'),
      allowNull: false,
    },
    entidadId: { // ID de la propiedad/cliente que quiere tocar
      type: DataTypes.UUID,
      allowNull: false,
    },
    motivo: { // "¿Por qué quieres editar?"
      type: DataTypes.TEXT,
      allowNull: false,
    },
    estado: {
      type: DataTypes.ENUM('PENDIENTE', 'APROBADO', 'RECHAZADO'),
      defaultValue: 'PENDIENTE',
    },
    adminId: { // Quién aprobó/rechazó
      type: DataTypes.UUID,
      allowNull: true,
    },
    respuestaAdmin: { // Nota del admin
      type: DataTypes.STRING,
      allowNull: true,
    }
  },
  {
    sequelize: db,
    modelName: 'SolicitudPermiso',
    tableName: 'solicitudes_permiso',
  }
);

export default SolicitudPermiso;