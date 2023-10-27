const Sequelize = require('sequelize');
const database = require('./../../database/db')
const bcrypt = require('bcrypt');

const Users = database.define('users', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    database: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    token_user: {
        type: Sequelize.STRING,
        allowNull: true,
    },
}, {
    freezeTableName: true,
    timestamps: true,
    hooks: {
        beforeCreate: async (user) => {
            if (user.password) {
                const salt = await bcrypt.genSaltSync(10, 'a');
                user.password = bcrypt.hashSync(user.password, salt);
            }
        },
        beforeUpdate: async (user) => {
            if (user.password) {
                const salt = await bcrypt.genSaltSync(10, 'a');
                user.password = bcrypt.hashSync(user.password, salt);
            }
        }
    },
})

module.exports = Users;