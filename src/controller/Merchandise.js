const connection = require("@server");
const logger = require("@logger");
const Select = require("@select");
const Insert = require("@insert");

const Merchandise = {



  async getMerchandiseNegotiationProvider(req, res) {
    logger.info("Get Merchandise to Negotiation to Provider");

    const { codprovider } = req.params;

    const queryConsult = "select mercadoria.codMercadoria, mercadoria.codFornMerc, mercadoria.nomeMercadoria, mercadoria.embMercadoria, FORMAT(mercadoria.precoMercadoria, 2, 'de_DE') as precoMercadoria, IFNULL(SUM(pedido.quantMercPedido),  0) as quantMercadoria, FORMAT(IFNULL(sum(mercadoria.precoMercadoria*pedido.quantMercPedido), 0), 2, 'de_DE') as 'valorTotal' from mercadoria join fornecedor on mercadoria.codFornMerc = fornecedor.codForn left outer join pedido on mercadoria.codMercadoria = pedido.codMercPedido where codFornMerc =  " + codprovider + " group by mercadoria.codMercadoria order by sum(mercadoria.precoMercadoria*pedido.quantMercPedido) desc";

    connection.query(queryConsult, (error, results, fields) => {
      if (error) {
        console.log("Error Select Merchandise to Negotiation to Provider: ", error);
      } else {
        return res.json(results);
      }
    });
    // connection.end();
  },

  async getMerchandiseClientProviderNegotiation(req, res) {
    logger.info("Get Merchandise to Client Negotiation to Provider");

    const { codclient, codprovider, codnegotiation } = req.params;

    const queryConsult = "select mercadoria.nomeMercadoria, mercadoria.embMercadoria, mercadoria.fatorMerc, IFNULL(SUM(pedido.quantMercPedido), 0) as 'quantMercadoria', mercadoria.precoMercadoria as precoMercadoria, IFNULL(SUM(mercadoria.precoMercadoria * pedido.quantMercPedido), 0) as 'valorTotal' from mercadoria join pedido on pedido.codMercPedido = mercadoria.codMercadoria where pedido.codAssocPedido = " + codclient + " and pedido.codfornpedido = " + codprovider + " and pedido.codNegoPedido = " + codnegotiation + " group by mercadoria.nomeMercadoria order by quantMercPedido";

    connection.query(queryConsult, (error, results, fields) => {
      if (error) {
        console.log("Error Select Merchandise to Client Negotiation to Provider: ", error);
      } else {
        return res.json(results);
      }
    });
    // connection.end();
  },

  async getMerchandiseProvider(req, res) {
    logger.info("Get Merchandise Provider");

    const { codprovider } = req.params;

    const queryConsult = `
    select fornecedor.codForn, 
fornecedor.nomeForn, 
mercadoria.codMercadoria, 
mercadoria.nomeMercadoria,
mercadoria.embMercadoria, 
mercadoria.fatorMerc, 
mercadoria.precoMercadoria as precoMercadoria, 
mercadoria.precoUnit as precoUnit,
IFNULL(sum(mercadoria.precoMercadoria*pedido.quantMercPedido), 0) as 'valorTotal', 
sum(pedido.quantMercPedido) as 'volumeTotal' 
from mercadoria 
join fornecedor on mercadoria.codFornMerc = fornecedor.codForn 
left join pedido on pedido.codMercPedido = mercadoria.codMercadoria
where fornecedor.codForn = ${codprovider}
group by mercadoria.codMercadoria 
order by pedido.quantMercPedido 
desc`;

    connection.query(queryConsult, (error, results, fields) => {
      if (error) {
        console.log("Error Select Merchandise Provider: ", error);
      } else {
        return res.json(results);
      }
    });
    // connection.end();
  },

  async getMerchandiseProviderIfClient(req, res) {
    logger.info("Get Merchandise Provider If Client");

    const { codclient, codprovider, codnegotiation } = req.params;

    const queryConsult = "SELECT mercadoria.codMercadoria, mercadoria.nomeMercadoria, mercadoria.embMercadoria, mercadoria.fatorMerc, mercadoria.precoMercadoria as precoMercadoria, IFNULL(SUM(pedido.quantMercPedido), 0) as quantMercadoria FROM mercadoria left outer JOIN pedido ON(mercadoria.codMercadoria = pedido.codMercPedido) and pedido.codAssocPedido = " + codclient + " and pedido.codNegoPedido = " + codnegotiation + " where mercadoria.codFornMerc = " + codprovider + " GROUP BY mercadoria.codMercadoria ORDER BY quantMercadoria desc";

    connection.query(queryConsult, (error, results, fields) => {
      if (error) {
        console.log("Error Select Merchandise Provider If Client: ", error);
      } else {
        return res.json(results);
      }
    });
    // connection.end();
  },


};

module.exports = Merchandise;
