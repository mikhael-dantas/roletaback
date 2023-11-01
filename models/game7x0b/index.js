const Sequelize = require('sequelize');
const database = require('./../../database/db')

const Game7x0b = database.define('game7x0b', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    number: {
        type: Sequelize.STRING,
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

module.exports = Game7x0b;