// roles.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';

export const Role = sequelize.define('role', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
}, {
    timestamps: false,
});
