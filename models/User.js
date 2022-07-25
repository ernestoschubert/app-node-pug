import { DataTypes } from 'sequelize';
import bcrypt from 'bcrypt';
import db from '../config/db.js'

const User = db.define('users', {
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    token: {
        type: DataTypes.STRING,
    },
    confirmed: {
        type: DataTypes.BOOLEAN
    },
}, {
    hooks: {
        beforeCreate: async function(user) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash( user.password, salt);
        }
    }
})

export default User;