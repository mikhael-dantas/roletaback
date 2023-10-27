const Sequelize = require('sequelize')


const sequelize = new Sequelize(
    process.env.DB_DATABASE,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        dialect: process.env.DB_DIALECT,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        logging: false
    }
);

// const sequelize = new Sequelize(
//     process.env.DB_DATABASE, 
//     process.env.DB_USER, 
//     process.env.DB_PASS, 
//     {
//         host: "127.0.0.1",
//         dialect : 'mysql',
//         operatorsAliases: false
//     }
//   );

module.exports = sequelize;