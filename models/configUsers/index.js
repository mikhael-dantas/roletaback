const Sequelize = require('sequelize');
const database = require('./../../database/db')

const Config_users = database.define('config_users', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    ultimo_registro: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    ultimo_length: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    jogador: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
}, {
    freezeTableName: true,
    timestamps: true
})

module.exports = Config_users;