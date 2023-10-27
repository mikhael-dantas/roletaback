// const cron = require("node-cron");
// const axios = require("axios");
// var moment = require("moment");
// const Game7x0b = require("./../../models/game7x0b");
// const database = require("./../../database/db");
// const { QueryTypes } = require('sequelize');
// const Socketio = require("./../../socketio")
// const gatilhosRackTrack = require("./../../const/");

// async function ResultGameUm() {


//     try {

//         await database.sync();
//         let arrayBanco = []
//         let arrayRequisicao = []

//         const infoBanco = await database.query("SELECT * FROM game7x0b LIMIT 190", { type: QueryTypes.SELECT });

//         for (const [index, element] of resposta.entries()) {
//             arrayRequisicao.push(element[0].number)
//         }

//         for (const [index, element] of infoBanco.entries()) {
//             arrayBanco.push(element.number)
//         }

//         console.log(arrayBanco)
//         console.log(arrayRequisicao)

//         if (arrayBanco.length === 0) {
//             for (const element of arrayRequisicao) {
//                 Game7x0b.create({
//                     number: element
//                 })
//             }
//         } else {

//             if (
//                 (arrayRequisicao[0] === arrayBanco[0]) &&
//                 (arrayRequisicao[1] === arrayBanco[1]) &&
//                 (arrayRequisicao[2] === arrayBanco[2]) &&
//                 (arrayRequisicao[3] === arrayBanco[3]) &&
//                 (arrayRequisicao[4] === arrayBanco[4])) {

//                 let io = Socketio.returnIo();
//                 io.sockets.emit("new-trigger", { newtrigger: "aguardando...", alltrigger: arrayBanco });


//             } else {
//                 await database.query("DELETE FROM game7x0b WHERE number!=''", { type: QueryTypes.DELETE });

//                 arrayBanco.unshift(arrayRequisicao[0])

//                 if (arrayBanco.length > 190) {
//                     arrayBanco.pop()
//                 }
//                 for (const element of arrayBanco) {
//                     await Game7x0b.create({
//                         number: element
//                     })
//                 }

//                 let io = Socketio.returnIo();
//                 io.sockets.emit("new-trigger", { newtrigger: arrayRequisicao[0], alltrigger: arrayBanco }
//                 );

//                 await getPayTrigger(arrayRequisicao[0], io)
//             }
//         }

//         console.log(moment().format("DD-MM-YYYY HH:mm:ss"));

//     } catch (error) {

//     }
// }

// async function getPayTrigger(gatilho, io) {

//     let resultado = null
//     laterais = null

//     if ([21, 5, 7, 2, 1, 0, 13, 32, 29, 9, 11].includes(Number(gatilho))) {

//         for (const item of gatilhosRackTrack) {

//             if (item.index === Number(gatilho)) {
//                 laterais = item.value
//             }
//         }

//         let qtdGat = await database.query(`SELECT COUNT('number') as number FROM game7x0b WHERE number=${gatilho}`, { type: QueryTypes.SELECT });

//         console.log(qtdGat)
//         console.log(qtdGat[0].number)
//         console.log(typeof qtdGat[0].number)

//         if (qtdGat[0].number > 1) {

//             saidas = await database.query(`SELECT * FROM game7x0b WHERE number=${gatilho} LIMIT 4`, { type: QueryTypes.SELECT });
//             saidas.shift()
//             resultado = await verifyPago(laterais, saidas, gatilho, qtdGat[0].number)

//             console.log(resultado)

//         } else {

//         }

//     }

//     io.sockets.emit("pay-trigger", resultado)

// }

// async function verifyPago(laterais, saidas, gatilho, qtd) {
//     let result = []
//     for (const [index, item] of saidas.entries()) {
//         for (const value of [1, 2, 3, 4, 5, 6, 7, 8]) {

//             let superior = await database.query(`SELECT id,number FROM game7x0b WHERE id=${item.id - value}`, { type: QueryTypes.SELECT });

//             if (laterais.includes(Number(superior[0].number))) {
//                 result.push({
//                     id: superior[0].id,
//                     ordem: index,
//                     gatilho: gatilho,
//                     rodada: value,
//                     qtd: qtd,
//                     superior: superior[0].number,
//                     pago: true
//                 })
//             } else {
//                 result.push({
//                     id: superior[0].id,
//                     ordem: index,
//                     gatilho: gatilho,
//                     rodada: value,
//                     qtd: qtd,
//                     superior: superior[0].number,
//                     pago: false
//                 })
//             }
//         }
//     }
//     return result
// }

// //module.exports = cron.schedule('*/15 * * * * *', ResultGameUm)


// //pegar todos as ocorrencias do gatilho
// //verificar se ela e maior que 1
// //remover a primeira
// //fazer nova pesquisa usando o array de gatilhos usando o id+ 1
// //verificar se ele esta entre os itens