import Cliente from './Cliente';
import Propiedad from './Propiedad';
import Interes from './Interes';
import Propietario from './Propietario';
import Usuario from './Usuario';
import Visita from './Visita';
import Seguimiento from './Seguimiento';
import Requerimiento from './Requerimiento';

export const definirAsociaciones = () => {
    Cliente.hasMany(Interes, { foreignKey: 'clienteId' });
    Interes.belongsTo(Cliente, { foreignKey: 'clienteId' });

    Propiedad.hasMany(Interes, { foreignKey: 'propiedadId' });
    Interes.belongsTo(Propiedad, { foreignKey: 'propiedadId' });

    Propiedad.belongsToMany(Propietario, { through: 'PropiedadPropietario' });
    Propietario.belongsToMany(Propiedad, { through: 'PropiedadPropietario' });

    Cliente.hasMany(Visita, { foreignKey: 'clienteId', as: 'visitas' });
    Visita.belongsTo(Cliente, { foreignKey: 'clienteId', as: 'cliente' });

    Propiedad.hasMany(Visita, { foreignKey: 'propiedadId', as: 'visitas' });
    Visita.belongsTo(Propiedad, { foreignKey: 'propiedadId', as: 'propiedad' });

    Usuario.hasMany(Visita, { foreignKey: 'asesorId', as: 'visitas' });
    Visita.belongsTo(Usuario, { foreignKey: 'asesorId', as: 'asesor' });

    // Relaciones Seguimiento
    Cliente.hasMany(Seguimiento, { foreignKey: 'clienteId' });
    Seguimiento.belongsTo(Cliente, { foreignKey: 'clienteId' });

    Propiedad.hasMany(Seguimiento, { foreignKey: 'propiedadId' });
    Seguimiento.belongsTo(Propiedad, { foreignKey: 'propiedadId' });

    Usuario.hasMany(Seguimiento, { foreignKey: 'usuarioId' });
    Seguimiento.belongsTo(Usuario, { foreignKey: 'usuarioId' });

    // REQUERIMIENTOS
    Cliente.hasMany(Requerimiento, { foreignKey: 'clienteId' });
    Requerimiento.belongsTo(Cliente, { foreignKey: 'clienteId' });
    
    Usuario.hasMany(Requerimiento, { foreignKey: 'usuarioId' });
    Requerimiento.belongsTo(Usuario, { foreignKey: 'usuarioId' });
};