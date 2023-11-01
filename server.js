const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT;
const cors = require("cors");
const consign = require("consign");
const Game7x0b = require("./models/game7x0b");
const Config_users = require("./models/configUsers");
const database = require("./database/db");
const { QueryTypes } = require("sequelize");
var moment = require("moment");
const Roulette = require("./classes/roulette");
const zeroTriggers = require("./const/zeroTriggers");
const voisnsTriggers = require("./const/voisns");
const { Op } = require("sequelize");
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
	cors: {
		origin: "*",
	},
});
const Socketio = require("./socketio");
const nomesRoletas = require("./const/nomesRoletas");
const zeroTriggersString = require("./const/zeroTriggersString");

app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "content-Type,x-requested-with");
	res.header(
		"Access-Control-Allow-Methods",
		"GET,POST,PUT,HEAD,DELETE,OPTIONS"
	);
	app.use(cors());
	next();
});

app.use(express.urlencoded({ extended: true }));

consign().include("api").into(app);

database.query("DELETE FROM game7x0b WHERE number!=''", {
	type: QueryTypes.DELETE,
});

io.on("connection", (socket) => {
	Socketio.setIo(io, socket.id);

	console.log(`Socketio Iniciado para o jogador`);
	
	socket.on("room", function (room) {
		console.log(room);
		socket.join(room);
	});

	socket.on("numbers", async (e) => {
		if (!e[2]) { return }
		console.log("numbers teste")
		console.log("e: ", e)
		let roulette = new Roulette(Number(e[2]))
		jogador = Number(e[2]);

		let nomeRoletta = e[1];

		// keep only the 500 most recent records and delete the rest
		Game7x0b.destroy({
			where: {
				id: {
					[Op.lt]: 500,
				},
				jogador: {
					[Op.eq]: jogador,
				},
			},
		});

		if (!nomesRoletas.light.includes(nomeRoletta)) {
			if (e[0].length === 0) {
				await roulette.resetarRoleta();
			} else {
				await roulette.separarNumerosEmArray(e[0]);

				let arrayBanco = await roulette.retornarArrayBanco();
				let arrayRequisicao = await roulette.retornarArrayRequisicao();
				let infoBanco = await roulette.retornarInfoBanco();
				ultimoRegistro = await roulette.retornarUltimoRegistro();

				await database.sync();

				
					let [historicoRoleta, created] = await Config_users.findOrCreate({
						where: {
							jogador: Number(e[2]),
						},
						defaults: {
							ultimo_registro: 0,
							ultimo_length: 0,
						},
					});

				historicoRoleta.ultimo_registro = Number(ultimoRegistro);
				await historicoRoleta.save();

				arrayRequisicao.reverse();

				if (
					infoBanco.length !== 0 &&
					historicoRoleta.ultimo_length !== arrayRequisicao.length
				) {
					await roulette.resetarRoleta();
				} else {
					if (arrayBanco.length === 0) {
						for (const element of arrayRequisicao) {
							await roulette.inserirNumeroNoBanco(element);
						}
					} else {
						if (arrayRequisicao.length === arrayBanco.length) {
							if (roulette.verificarDivergencias(arrayRequisicao, arrayBanco)) {
								arrayBanco.shift();
								arrayBanco.push(arrayRequisicao[arrayRequisicao.length - 1]);

								await roulette.deletarUltimoRegistro(
									historicoRoleta.ultimo_registro
								);

								await roulette.inserirNumeroNoBanco(
									arrayRequisicao[arrayRequisicao.length - 1]
								);

								arrayBanco.reverse();

								let vizinhosPagos = null;
								let voisnsPagos = null;
								let xxxextreme = null;

								if (zeroTriggers.includes(Number(arrayRequisicao[arrayRequisicao.length - 1]))) {
									vizinhosPagos = await roulette.verificarVizinhosZero();
								}

								if (voisnsTriggers.includes(Number(arrayRequisicao[arrayRequisicao.length - 1]))) {
									voisnsPagos = await roulette.verificarVizinhosVoisns();
								}

								if (nomesRoletas.light.includes(nomeRoletta)) {
									xxxextreme = await roulette.verificarMultiplicadores();
								}

								let historyPayNumbers =
									await roulette.verificarPagosOitoUltimos(arrayRequisicao);

								arrayRequisicao.reverse();

								let io = Socketio.returnIo();
								io.sockets.emit("new-trigger", {
									newtrigger: arrayRequisicao[arrayRequisicao.length - 1],
									alltrigger: arrayBanco,
									nomeRoletta: nomeRoletta,
									vizinhosPagos: vizinhosPagos,
									historyPayNumbers: historyPayNumbers,
									voisnsPagos: voisnsPagos,
									xxxextreme: xxxextreme, 
								}, e[2]);

								await roulette.getPayTrigger(arrayRequisicao[arrayRequisicao.length - 1], io);
							} else {
								if (roulette.verificarDivergenciasZerar(arrayRequisicao, arrayBanco)) {
									arrayBanco.reverse();

									let io = Socketio.returnIo();
									io.sockets.emit("new-trigger", {
										newtrigger: "aguardando...",
										alltrigger: arrayBanco,
										nomeRoletta: nomeRoletta,
									}, e[2]);
								} else {
									await roulette.resetarRoleta();
								}
							}
						} else {
							await roulette.resetarRoleta();
						}
					}
				}

				let numbersLength = await roulette.retornarNumbers();

				if (numbersLength?.length) {
					historicoRoleta.ultimo_length = Number(numbersLength.length);
					await historicoRoleta.save();
				}

				console.log(moment().format("DD-MM-YYYY HH:mm:ss"));

				await roulette.resetarAtributos();
			}
		}

		if (nomesRoletas.light.includes(nomeRoletta)) {
			if (e[0].length === 0) {
				await roulette.resetarRoleta();
			} else {
				await roulette.separarNumerosEmArray(e[0]);

				let arrayBanco = await roulette.retornarArrayBanco();
				let arrayRequisicao = await roulette.retornarArrayRequisicao();
				let infoBanco = await roulette.retornarInfoBanco();
				ultimoRegistro = await roulette.retornarUltimoRegistro();

				let [historicoRoleta, created] = await Config_users.findOrCreate({
					where: {
						jogador: Number(e[2]),
					},
					defaults: {
						ultimo_registro: 0,
						ultimo_length: 0,
					},
				});

				historicoRoleta.ultimo_registro = Number(ultimoRegistro);
				await historicoRoleta.save();

				arrayRequisicao.reverse();

				if (
					infoBanco.length !== 0 &&
					historicoRoleta.ultimo_length !== arrayRequisicao.length
				) {
					await roulette.resetarRoleta();
				} else {
					if (arrayBanco.length === 0) {
						for (const element of arrayRequisicao) {
							await roulette.inserirNumeroNoBanco(element);
						}
					} else {
						if (arrayRequisicao.length === arrayBanco.length) {
							if (roulette.verificarDivergencias(arrayRequisicao, arrayBanco)) {
								arrayBanco.shift();
								arrayBanco.push(arrayRequisicao[arrayRequisicao.length - 1]);

								await roulette.deletarUltimoRegistro(
									historicoRoleta.ultimo_registro
								);

								await roulette.inserirNumeroNoBanco(
									arrayRequisicao[arrayRequisicao.length - 1]
								);

								arrayBanco.reverse();

								let vizinhosPagos = null;
								let voisnsPagos = null;
								let xxxextreme = null;

								if (
									zeroTriggersString.includes(
										String(arrayRequisicao[arrayRequisicao.length - 1])
									)
								) {
									vizinhosPagos = await roulette.verificarVizinhosZeroString();
								}

								if (
									voisnsTriggers.includes(
										String(arrayRequisicao[arrayRequisicao.length - 1])
									)
								) {
									voisnsPagos = await roulette.verificarVizinhosVoisnsString();
								}

								if (nomesRoletas.light.includes(nomeRoletta)) {
									xxxextreme = await roulette.verificarMultiplicadores();
								}

								let historyPayNumbers =
									await roulette.verificarPagosOitoUltimosString(
										arrayRequisicao
									);

								arrayRequisicao.reverse();

								let io = Socketio.returnIo();
								io.sockets.emit("new-trigger", {
									newtrigger: arrayRequisicao[arrayRequisicao.length - 1],
									alltrigger: arrayBanco,
									nomeRoletta: nomeRoletta,
									vizinhosPagos: vizinhosPagos,
									historyPayNumbers: historyPayNumbers,
									voisnsPagos: voisnsPagos,
									xxxextreme: xxxextreme,
								}, e[2]);

								await roulette.getPayTriggerString(
									arrayRequisicao[arrayRequisicao.length - 1],
									io
								);
							} else {
								if (
									roulette.verificarDivergenciasZerar(
										arrayRequisicao,
										arrayBanco
									)
								) {
									arrayBanco.reverse();

									let io = Socketio.returnIo();
									io.sockets.emit("new-trigger", {
										newtrigger: "aguardando...",
										alltrigger: arrayBanco,
										nomeRoletta: nomeRoletta,
									}, e[2]);
								} else {
									await roulette.resetarRoleta();
								}
							}
						} else {
							await roulette.resetarRoleta();
						}
					}
				}

				let numbersLength = await roulette.retornarNumbers();

				if (numbersLength?.length) {
					historicoRoleta.ultimo_length = Number(numbersLength.length);
					await historicoRoleta.save();
				}

				console.log(moment().format("DD-MM-YYYY HH:mm:ss"));

				await roulette.resetarAtributos();
			}
		}


	});

	socket.on("disconnect", async () => {
		console.log(`jogador desconeectado`);
		// await database.query(`DELETE FROM game7x0b WHERE number!='' AND jogador=${jogador}`, {
		// 	type: QueryTypes.DELETE,
		// });
	});
});

server.listen(port, () => {
	console.log("Serviço rodando na porta: " + port);
});
