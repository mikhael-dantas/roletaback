const axios = require("axios");
const Game7x0b = require("./../models/game7x0b");
const database = require("./../database/db");
const { QueryTypes } = require('sequelize');
const Users = require("../models/users");
const { Op } = require("sequelize");
const bcrypt = require('bcrypt');
const fs = require('fs');


module.exports = async (app) => {

    app.get("/api/roleta", async (req, res) => {

        return res.send({ req: arrayRequisicao, banco: arrayBanco })
    });

    // app.get("api/resetx", async (req, res) => {

    // });
    
    // Exemplo de uso:
    // addJogadorColumnToGame7x0b(databaseInstance);
    
    
    app.get("/api/immersive-roulette", async (req, res) => {
        // try {
        //     // add column 'jogador' to table game7x0b
        //     await database.query("ALTER TABLE game7x0b ADD COLUMN jogador INT", { type: QueryTypes.RAW });
        //     console.log("Coluna 'jogador' adicionada com sucesso à tabela game7x0b!");
    
        //     // add column 'jogador' to table config_users
        //     await database.query("ALTER TABLE config_users ADD COLUMN jogador INT", { type: QueryTypes.RAW });
        //     console.log("Coluna 'jogador' adicionada com sucesso à tabela config_users!");
        // } catch (error) {
        //     console.error("Erro ao adicionar a coluna 'jogador' à tabela game7x0b:", error);
        // }
        console.log("chamou números");
        let ultimosNumeros = null

        try {

            ultimosNumeros = await database.query("SELECT * FROM game7x0b LIMIT 5", { type: QueryTypes.SELECT });
            users = await Users.findAll()
            console.log("users: ", users)

        } catch (error) {

            return res.json({ error: error })

        }

        return res.json({ ultimos: ultimosNumeros })
    });

    app.post("/api/login", async (req, res) => {
        console.log("loginnnnnnnnnnnnnnnnnnnnnnnnnn")
        console.log("email: ", req.body.email)
        console.log("senha: ", req.body.password)
        try {
            const user = await Users.findOne({
                where: {
                    email: req.body.email
                }
            });
            
            if (user) {
                if (bcrypt.compareSync(req.body.password, user.password)) {
                    console.log("loginnnnnnnnnnnnnnnnnnnnnnnnnn sucesso")
                    return res.json({ isLogged: true, user: user });
                } else {
                    console.log("senha inválida")
                    return res.json({ isLogged: false, reason: "Senha inválida" });
                }
            } else {
                console.log("Usuário não encontrado")
                return res.error({ isLogged: false, reason: "Usuário não encontrado" });
            }
        } catch (error) {
            console.error("Erro no banco de dados:", error);
            return res.status(500).json({ isLogged: false, reason: "Erro no banco de dados" });
        }
    });
    

    app.post("/api/user/create", async (req, res) => {

        await database.sync();

        try {
            let user = await Users.create({
                name: null,
                email: req.body.email,
                password: req.body.password,
                user_token: null,
                database: null
            })

            // var salt = geraStringAleatoria(8);

            // const dir = `models\\${salt}`;

            // if (!fs.existsSync(dir)) {

            //     fs.mkdirSync(dir);
            // }

            // fs.writeFile(`models\\${salt}\\${salt}.js`, `
            // const Sequelize = require('sequelize');
            // const database = require('./../../database/db')

            // const ${salt} = database.define('${salt}', {
            //     id: {
            //         type: Sequelize.INTEGER,
            //         autoIncrement: true,
            //         allowNull: false,
            //         primaryKey: true
            //     },
            //     number: {
            //         type: Sequelize.STRING,
            //         allowNull: false,
            //     },

            // }, {
            //     freezeTableName: true,
            //     timestamps: true
            // })

            // module.exports = ${salt};
            // `, function (erro) {

            //     if (erro) {
            //         throw erro;
            //     }

            //     console.log("Arquivo salvo");
            // });

            // user.database = salt
            // user.save()

        } catch (error) {
            console.log(error)
            return res.json(error)
        }

        return res.json("Usuário criado com sucesso")
    });


    app.post("/api/teste", async (req, res) => {

        return res.json("Usuário criado com sucesso")
    });


    function geraStringAleatoria(tamanho) {
        var stringAleatoria = '';
        var caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        for (var i = 0; i < tamanho; i++) {
            stringAleatoria += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
        }
        return stringAleatoria;
    }
};