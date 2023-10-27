const Game7x0b = require("./../models/game7x0b");
const database = require("./../database/db");
const { QueryTypes } = require("sequelize");
const arrayTriggers = require("./../const/allTriggers");
const gatilhosRaceTrack = require("./../const/gatilhosRaceTrack");
const zeroTriggers = require("../const/zeroTriggers");
const voisnsTriggers = require("../const/voisns");
const zeroTriggersString = require("../const/zeroTriggersString");
const voisnsTriggersString = require("../const/voisnsString");
const arrayTriggersString = require("../const/allTriggersString");
const gatilhosRaceTrackString = require("../const/gatilhosRaceTrackString");

class Roulette {
  constructor() {
    this.ultimoRegistro;
    this.arrayRequisicao = [];
    this.arrayBanco = [];
    this.infoBanco;
    this.numbers;
  }

  async deletarUltimoRegistro(ultimoRegistro) {
    await database.query(`DELETE FROM game7x0b WHERE id=${ultimoRegistro}`, {
      type: QueryTypes.DELETE,
    });
  }

  async verificarMultiplicadores() {
    let vizinhosVoisns = [];
    let vizinhosPago = [];

    await database.sync();

    let allTriggers = await database.query(
      `SELECT * FROM game7x0b order by id desc`,
      { type: QueryTypes.SELECT }
    );

    for (const [index, i] of allTriggers.entries()) {
      if (i.number.indexOf("x") != -1) {
        if (vizinhosVoisns.length < 11) {
          vizinhosVoisns.push(i);
        }
      }
    }

    for (let index = 0; index < vizinhosVoisns.length - 1; index++) {
      if (vizinhosPago.length < 10) {
        vizinhosPago.push(
          vizinhosVoisns[index].id - vizinhosVoisns[index + 1].id
        );
      }
    }

    return vizinhosPago;
  }

  async verificarVizinhosVoisnsString() {
    let vizinhosVoisns = [];
    let vizinhosPago = [];

    await database.sync();

    let allTriggers = await database.query(
      `SELECT * FROM game7x0b order by id desc`,
      { type: QueryTypes.SELECT }
    );

    for (const i of allTriggers) {
      if (voisnsTriggersString.includes(String(i.number))) {
        if (vizinhosVoisns.length < 11) {
          vizinhosVoisns.push(i);
        }
      }
    }

    for (let index = 0; index < vizinhosVoisns.length; index++) {
      if (vizinhosPago.length < 10) {
        vizinhosPago.push(
          vizinhosVoisns[index].id - vizinhosVoisns[index + 1].id - 1
        );
      }
    }

    return vizinhosPago;
  }

  async verificarVizinhosVoisns() {
    let vizinhosVoisns = [];
    let vizinhosPago = [];

    await database.sync();

    let allTriggers = await database.query(
      `SELECT * FROM game7x0b order by id desc`,
      { type: QueryTypes.SELECT }
    );

    for (const i of allTriggers) {
      if (voisnsTriggers.includes(Number(i.number))) {
        if (vizinhosVoisns.length < 11) {
          vizinhosVoisns.push(i);
        }
      }
    }

    for (let index = 0; index < vizinhosVoisns.length - 1; index++) {
      if (vizinhosPago.length < 10) {
        vizinhosPago.push(
          vizinhosVoisns[index].id - vizinhosVoisns[index + 1].id - 1
        );
      }
    }

    return vizinhosPago;
  }

  async verificarVizinhosZeroString() {
    let vizinhosZero = [];
    let vizinhosPago = [];

    await database.sync();

    let allTriggers = await database.query(
      `SELECT * FROM game7x0b order by id desc`,
      { type: QueryTypes.SELECT }
    );

    for (const i of allTriggers) {
      if (zeroTriggersString.includes(String(i.number))) {
        if (vizinhosZero.length < 11) {
          vizinhosZero.push(i);
        }
      }
    }

    for (let index = 0; index < vizinhosZero.length; index++) {
      if (vizinhosPago.length < 10) {
        vizinhosPago.push(
          vizinhosZero[index].id - vizinhosZero[index + 1].id - 1
        );
      }
    }

    return vizinhosPago;
  }

  async verificarVizinhosZero() {
    let vizinhosZero = [];
    let vizinhosPago = [];

    await database.sync();

    let allTriggers = await database.query(
      `SELECT * FROM game7x0b order by id desc`,
      { type: QueryTypes.SELECT }
    );

    for (const i of allTriggers) {
      if (zeroTriggers.includes(Number(i.number))) {
        if (vizinhosZero.length < 11) {
          vizinhosZero.push(i);
        }
      }
    }

    for (let index = 0; index < vizinhosZero.length; index++) {
      if (vizinhosPago.length < 10) {
        vizinhosPago.push(
          vizinhosZero[index].id - vizinhosZero[index + 1].id - 1
        );
      }
    }

    return vizinhosPago;
  }

  async verificarPagosOitoUltimosString(requisicao) {
    requisicao.reverse();

    let req = requisicao.slice(0, 12);
    let resp = [[], [], [], [], [], [], [], [], [], [], [], []];
    let pay = [1, 2, 3];

    for (let i = 0; i < req.length; i++) {
      if (arrayTriggersString.includes(String(req[i]))) {
        let laterais = null;

        for (let k = 0; k < gatilhosRaceTrackString.length; k++) {
          if (gatilhosRaceTrackString[k].index === String(req[i])) {
            laterais = gatilhosRaceTrackString[k].value;
          }
        }

        for (let j = 0; j < pay.length; j++) {
          if (laterais !== null) {
            if (laterais.includes(String(req[i - pay[j]]))) {
              resp[i].push(pay[j]);

              break;
            }
          }
        }
      }
    }

    return resp;
  }

  async verificarPagosOitoUltimos(requisicao) {
    requisicao.reverse();

    let req = requisicao.slice(0, 12);
    let resp = [[], [], [], [], [], [], [], [], [], [], [], []];
    let pay = [1, 2, 3];

    for (let i = 0; i < req.length; i++) {
      if (arrayTriggers.includes(Number(req[i]))) {
        let laterais = null;

        for (let k = 0; k < gatilhosRaceTrack.length; k++) {
          if (gatilhosRaceTrack[k].index === Number(req[i])) {
            laterais = gatilhosRaceTrack[k].value;
          }
        }

        for (let j = 0; j < pay.length; j++) {
          if (laterais !== null) {
            if (laterais.includes(Number(req[i - pay[j]]))) {
              resp[i].push(pay[j]);

              break;
            }
          }
        }
      }
    }

    return resp;
  }

  verificarDivergencias(requisicao, banco) {
    if (
      requisicao[requisicao.length - 2] === banco[banco.length - 1] &&
      requisicao[requisicao.length - 3] === banco[banco.length - 2] &&
      requisicao[requisicao.length - 4] === banco[banco.length - 3] &&
      requisicao[requisicao.length - 5] === banco[banco.length - 4] &&
      requisicao[requisicao.length - 6] === banco[banco.length - 5]
    ) {
      return true;
    }

    return false;
  }

  verificarDivergenciasZerar(requisicao, banco) {
    if (
      requisicao[requisicao.length - 1] === banco[banco.length - 1] &&
      requisicao[requisicao.length - 2] === banco[banco.length - 2] &&
      requisicao[requisicao.length - 3] === banco[banco.length - 3] &&
      requisicao[requisicao.length - 4] === banco[banco.length - 4] &&
      requisicao[requisicao.length - 5] === banco[banco.length - 5]
    ) {
      return true;
    }

    return false;
  }

  async resetarAtributos() {
    this.ultimoRegistro = null;
    this.arrayRequisicao = [];
    this.arrayBanco = [];
    this.infoBanco = null;
    this.numbers = null;
  }

  async resetarRoleta() {
    await database.query("DELETE FROM game7x0b WHERE number!=''", {
      type: QueryTypes.DELETE,
    });
  }

  async inserirNumeroNoBanco(e) {
    await Game7x0b.create({
      number: e,
    });
  }

  async separarNumerosEmArray(e) {
    this.numbers = e.split(",");

    await database.sync();

    this.infoBanco = await database.query(
      `SELECT * FROM game7x0b LIMIT ${this.numbers.length}`,
      { type: QueryTypes.SELECT }
    );

    if (this.infoBanco.length !== 0) {
      this.ultimoRegistro = this.infoBanco[0].id;
    }

    for (const [index, element] of this.numbers.entries()) {
      this.arrayRequisicao.push(element);
    }

    if (this.infoBanco.length !== 0) {
      for (const [index, element] of this.infoBanco.entries()) {
        this.arrayBanco.push(element.number);
      }
    }
  }

  async getPayTrigger(gatilho, io) {
    let resultado = null;
    let laterais = null;

    if (arrayTriggers.includes(Number(gatilho))) {
      for (const item of gatilhosRaceTrack) {
        if (item.index === Number(gatilho)) {
          laterais = item.value;
        }
      }

      let qtdGat = await database.query(
        `SELECT COUNT('number') as number FROM game7x0b WHERE number=${gatilho}`,
        { type: QueryTypes.SELECT }
      );

      if (qtdGat[0].number > 1) {
        let saidas = await database.query(
          `SELECT * FROM game7x0b WHERE number=${gatilho} order by id desc LIMIT 4`,
          { type: QueryTypes.SELECT }
        );

        saidas.shift();

        resultado = await this.verifyPago(
          laterais,
          saidas,
          gatilho,
          qtdGat[0].number
        );
      }
    }

    io.sockets.emit("pay-trigger", resultado);
  }

  async getPayTriggerString(gatilho, io) {
    let resultado = null;
    let laterais = null;

    if (arrayTriggersString.includes(String(gatilho))) {
      for (const item of gatilhosRaceTrackString) {
        if (item.index === String(gatilho)) {
          laterais = item.value;
        }
      }

      let qtdGat = await database.query(
        `SELECT COUNT('number') as number FROM game7x0b WHERE number="${gatilho}"`,
        { type: QueryTypes.SELECT }
      );

      if (qtdGat[0].number > 1) {
        let saidas = await database.query(
          `SELECT * FROM game7x0b WHERE number="${gatilho}" order by id desc LIMIT 4`,
          { type: QueryTypes.SELECT }
        );

        saidas.shift();

        resultado = await this.verifyPagoString(
          laterais,
          saidas,
          gatilho,
          qtdGat[0].number
        );
      }
    }

    io.sockets.emit("pay-trigger", resultado);
  }

  async verifyPagoString(laterais, saidas, gatilho, qtd) {
    let result = [];

    for (const [index, item] of saidas.entries()) {
      for (const value of [1, 2, 3, 4, 5, 6, 7, 8]) {
        let superior = await database.query(
          `SELECT id,number FROM game7x0b WHERE id=${item.id + value}`,
          { type: QueryTypes.SELECT }
        );

        if (superior.length !== 0) {
          if (laterais.includes(String(superior[0].number))) {
            result.push({
              id: superior[0].id,
              ordem: index,
              gatilho: gatilho,
              rodada: value,
              qtd: qtd,
              superior: superior[0].number,
              pago: "sim",
            });
          } else {
            result.push({
              id: superior[0].id,
              ordem: index,
              gatilho: gatilho,
              rodada: value,
              qtd: qtd,
              superior: superior[0].number,
              pago: "nao",
            });
          }
        } else {
          result.push({
            id: null,
            ordem: index,
            gatilho: gatilho,
            rodada: value,
            qtd: qtd,
            superior: null,
            pago: "nda",
          });
        }
      }
    }
    return result;
  }

  async verifyPago(laterais, saidas, gatilho, qtd) {
    let result = [];

    for (const [index, item] of saidas.entries()) {
      for (const value of [1, 2, 3, 4, 5, 6, 7, 8]) {
        let superior = await database.query(
          `SELECT id,number FROM game7x0b WHERE id=${item.id + value}`,
          { type: QueryTypes.SELECT }
        );

        if (superior.length !== 0) {
          if (laterais.includes(Number(superior[0].number))) {
            result.push({
              id: superior[0].id,
              ordem: index,
              gatilho: gatilho,
              rodada: value,
              qtd: qtd,
              superior: superior[0].number,
              pago: "sim",
            });
          } else {
            result.push({
              id: superior[0].id,
              ordem: index,
              gatilho: gatilho,
              rodada: value,
              qtd: qtd,
              superior: superior[0].number,
              pago: "nao",
            });
          }
        } else {
          result.push({
            id: null,
            ordem: index,
            gatilho: gatilho,
            rodada: value,
            qtd: qtd,
            superior: null,
            pago: "nda",
          });
        }
      }
    }
    return result;
  }

  async retornarNumbers() {
    return this.numbers;
  }

  async setUltimoRegistro(e) {
    this.ultimoRegistro = e;
  }

  async retornarUltimoRegistro() {
    return this.ultimoRegistro;
  }

  async retornarArrayRequisicao() {
    return this.arrayRequisicao;
  }

  async retornarArrayBanco() {
    return this.arrayBanco;
  }

  async retornarInfoBanco() {
    return this.infoBanco;
  }
}

module.exports = Roulette;
