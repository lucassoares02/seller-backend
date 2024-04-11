const connection = require("@server");
const logger = require("@logger");
const select = require("@select");
const Insert = require("@insert");

const Graphs = {

  async getPercentageClients(req, res) {
    logger.info("Get Percentage Clients");

    const { codprovider } = req.params;

    const queryConsult = ` select (COUNT(DISTINCT pedido.codAssocPedido) * 100.0) / (select COUNT(*) FROM associado) AS porcentagem, COUNT(DISTINCT pedido.codAssocPedido) AS realizados, (select COUNT(*) FROM associado) AS total FROM pedido WHERE pedido.codFornPedido = ${codprovider}`;

    connection.query(queryConsult, (error, results, fields) => {
      if (error) {
        console.log("Error select Percentage Clients: ", error);
      } else {
        return res.json(results);
      }
    });
    // connection.end();
  },

  async getPercentagePovidersByClients(req, res) {
    logger.info("Get Percentage Providers by Clients");

    const { codbuyer } = req.params;

    const queryConsult = `
     select (COUNT(DISTINCT pedido.codFornPedido ) * 100.0) / (select COUNT(*) 
    FROM fornecedor f) AS porcentagem,
    COUNT(DISTINCT pedido.codFornPedido) AS realizados, 
    (select COUNT(*) FROM fornecedor f2) AS total
    FROM pedido 
    WHERE pedido.codComprPedido  = ${codbuyer}
    `;

    connection.query(queryConsult, (error, results, fields) => {
      if (error) {
        console.log("Error select Percentage Providers by Clients: ", error);
      } else {
        return res.json(results);
      }
    });
    // connection.end();
  },

  async getPercentageClientsOrganization(req, res) {
    logger.info("Get Percentage Clients Organization");

    const queryConsult = `  select 
    (COUNT(DISTINCT pedido.codAssocPedido) * 100.0) / (select COUNT(*) FROM associado) AS porcentagem, 
    COUNT(DISTINCT pedido.codAssocPedido) AS realizados, (select COUNT(*) FROM associado) AS total FROM pedido`;

    connection.query(queryConsult, (error, results, fields) => {
      if (error) {
        console.log("Error select Percentage Clients: ", error);
      } else {
        return res.json(results);
      }
    });
    // connection.end();
  },

  async getPercentageProvidersOrganization(req, res) {
    logger.info("Get Percentage Providers Organization");

    const queryConsult = `
     select 
    (COUNT(DISTINCT pedido.codFornPedido) * 100.0) / (select COUNT(*) FROM fornecedor) AS porcentagem, 
    COUNT(DISTINCT pedido.codFornPedido) AS realizados, 
    (select COUNT(*) FROM fornecedor f) AS total FROM pedido `;

    connection.query(queryConsult, (error, results, fields) => {
      if (error) {
        console.log("Error select Percentage Providers: ", error);
      } else {
        return res.json(results);
      }
    });
    // connection.end();
  },

  async getTotalValueClients(req, res) {
    logger.info("Get Total Value Clients");

    const { codprovider } = req.params;

    const queryConsult = ` select a.razao, FORMAT(SUM(IFNULL(m.precoMercadoria * p.quantMercPedido, 0)), 2, 'de_DE') AS 'valorTotal' FROM associado AS a LEFT JOIN pedido AS p ON p.codAssocPedido = a.codAssociado LEFT JOIN relacionafornecedor AS rf ON rf.codFornecedor = p.codFornPedido LEFT JOIN mercadoria AS m ON m.codMercadoria = p.codMercPedido AND rf.codFornecedor = ${codprovider} GROUP BY a.codAssociado, a.cnpjAssociado, a.razao ORDER BY SUM(IFNULL(m.precoMercadoria * p.quantMercPedido, 0)) DESC;`;

    connection.query(queryConsult, (error, results, fields) => {
      if (error) {
        console.log("Error select Total Value Clients: ", error);
      } else {
        return res.json(results);
      }
    });
    // connection.end();
  },

  async getTotalInformations(req, res) {
    logger.info("Get Total Informations");

    const queryConsult = ` select
      sum(pedido.quantMercPedido * mercadoria.precoMercadoria) as total
      from pedido 
      join mercadoria on mercadoria.codMercadoria = pedido.codMercPedido 
      union 
      select
      count(associado.codAssociado) as associados
      from associado
      union
      select 
      count(fornecedor.codForn) as fornecedores
      from fornecedor
      union
      select 
      count(mercadoria.codMercadoria) as mercadorias
      from mercadoria
    `;

    connection.query(queryConsult, (error, results, fields) => {
      if (error) {
        console.log("Error select Total Informations: ", error);
      } else {

        let data = [];
        const titles = ["Total negociado", "Associados", "Fonecedores", "Mercadorias"];

        i = 0;
        for (i = 0; i < results[1].length; i++) {
          data.push({
            title: titles[i],
            addInfo: "",
            icon: "",
            color: "",
            total: results[1][i]["total"] != null ? results[1][i]["total"] : 0,
          });
        }
        res.json(data);
      }
    });
    // connection.end();
  },

};

module.exports = Graphs;
