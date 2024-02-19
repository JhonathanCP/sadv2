import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';

export const Dependencia = sequelize.define('dependencia', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    activo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    principal: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
});

// Establecer la relación uno a muchos consigo mismo
Dependencia.hasMany(Dependencia, { as: 'subdependencias', foreignKey: 'dependenciaPrincipalId' });
Dependencia.belongsTo(Dependencia, { as: 'dependenciaPrincipal', foreignKey: 'dependenciaPrincipalId' });
