const connection = require("@server");
const logger = require("@logger");
const Select = require("@select");
const Insert = require("@insert");

const Graphs = {

  async getPercentageClients(req, res) {
    logger.info("Get Percentage Clients");

    const { codprovider } = req.params;

    const queryConsult = `select (COUNT(DISTINCT pedido.codAssocPedido) * 100.0) / (SELECT COUNT(*) FROM associado) AS porcentagem from pedido where pedido.codFornPedido = ${codprovider}`;

    connection.query(queryConsult, (error, results, fields) => {
      if (error) {
        console.log("Error Select Percentage Clients: ", error);
      } else {
        return res.json(results);
      }
    });
    // connection.end();
  },




};

module.exports = Graphs;
