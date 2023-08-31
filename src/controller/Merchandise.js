const connection = require("@server");
const logger = require("@logger");
const Select = require("@select");
const Insert = require("@insert");

const Merchandise = {



  async getMerchandiseNegotiationProvider(req, res) {
    logger.info("Get Merchandise to Negotiation to Provider");

    const { codprovider, codnegotiation } = req.params;

    const queryConsult = `
    select 
    mercadoria.codMercadoria, 
    mercadoria.codFornMerc, 
    mercadoria.nomeMercadoria, 
    mercadoria.embMercadoria, 
    mercadoria.fatorMerc,
    mercadoria.precoMercadoria as precoMercadoria, 
    IFNULL(SUM(pedido.quantMercPedido),  0) as quantMercadoria, 
    IFNULL(sum(mercadoria.precoMercadoria*pedido.quantMercPedido), 0) as 'valorTotal' 
    from mercadoria 
    join fornecedor on mercadoria.codFornMerc = fornecedor.codForn 
    left outer join pedido on mercadoria.codMercadoria = pedido.codMercPedido 
    where codFornMerc = ${codprovider} and pedido.codNegoPedido = ${codnegotiation}
    group by mercadoria.codMercadoria 
    order by sum(mercadoria.precoMercadoria*pedido.quantMercPedido) 
    desc
`;

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
IFNULL(sum(pedido.quantMercPedido),0) as 'volumeTotal' 
from mercadoria 
join fornecedor on mercadoria.codFornMerc = fornecedor.codForn 
left join pedido on pedido.codMercPedido = mercadoria.codMercadoria
where fornecedor.codForn = ${codprovider}
group by mercadoria.codMercadoria 
order by valorTotal 
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


  async getMerchandisePerCustomer(req, res) {
    logger.info("Get Merchandise Provider If Client");

    const { codclient, codeprovider } = req.params;

    const queryConsult = `
    SELECT 
    mercadoria.codMercadoria,
    mercadoria.nomeMercadoria,
    mercadoria.embMercadoria, 
    mercadoria.fatorMerc, 
    mercadoria.precoUnit ,
    mercadoria.precoMercadoria as precoMercadoria,
    IFNULL(SUM(pedido.quantMercPedido), 0) as volumeTotal 
    FROM mercadoria 
    left outer JOIN pedido ON(mercadoria.codMercadoria = pedido.codMercPedido) 
    and pedido.codComprPedido = ${codclient}
    where mercadoria.codFornMerc = ${codeprovider}
    GROUP BY mercadoria.codMercadoria
    ORDER BY volumeTotal 
    desc`;

    connection.query(queryConsult, (error, results, fields) => {
      if (error) {
        console.log("Error Select Merchandise Provider If Client: ", error);
      } else {
        return res.json(results);
      }
    });
    // connection.end();
  },


  async getMerchandiseNegotiationProvider(req, res) {
    logger.info("Get Merchandise Provider If Client");

    const { codprovider, codnegotiation } = req.params;

    const queryConsult = `
    SELECT mercadoria.codMercadoria, 
    mercadoria.nomeMercadoria, 
    mercadoria.embMercadoria, 
    mercadoria.fatorMerc, 
    mercadoria.precoMercadoria as precoMercadoria, 
    IFNULL(SUM(pedido.quantMercPedido), 0) as quantMercadoria 
    FROM mercadoria 
    left outer 
    JOIN pedido ON(mercadoria.codMercadoria = pedido.codMercPedido) 
    and pedido.codNegoPedido = ${codnegotiation} 
    where mercadoria.codFornMerc = ${codprovider}
    GROUP BY mercadoria.codMercadoria 
    ORDER BY quantMercadoria 
    desc`;

    connection.query(queryConsult, (error, results, fields) => {
      if (error) {
        console.log("Error Select Merchandise Provider If Client: ", error);
      } else {
        return res.json(results);
      }
    });
    // connection.end();
  },


  async postInsertMerchandise(req, res) {
    logger.info("Post Save Merchandise");

    const { codMercadoria, nomeMercadoria, codFornMerc, embMercadoria, fatorMerc, precoMercadoria, precoUnit } = req.body;


    console.log("***********************");
    console.log(codMercadoria);
    console.log(nomeMercadoria);
    console.log(codFornMerc);
    console.log(embMercadoria);
    console.log(fatorMerc);
    console.log(precoMercadoria);
    console.log(precoUnit);
    console.log("***********************");


    let data = {
      codMercadoria: codMercadoria,
      nomeMercadoria: nomeMercadoria,
      codFornMerc: codFornMerc,
      embMercadoria: embMercadoria,
      fatorMerc: fatorMerc,
      precoMercadoria: precoMercadoria,
      precoUnit: precoUnit,
    }

    console.log("=================================");
    console.log(data);
    console.log("=================================");

    let params = {
      table: "mercadoria",
      data: data
    }

    console.log("-------------------------------");
    console.log("-------------------------------");
    console.log(params);
    console.log("-------------------------------");

    return Insert(params)
      .then(async (resp) => {
        res.status(200).send(`message: Save Success!`);
      })
      .catch((error) => {
        console.log(error);
        return res.status(400).send(`message: deu algum erro`);
      });


    // connection.end();
  },

};

module.exports = Merchandise;
