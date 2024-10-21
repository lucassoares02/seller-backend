const { connection } = require("@server");
const logger = require("@logger");
const Select = require("@select");
const Insert = require("@insert");

const Merchandise = {

  async patchMerchandise(req, res) {
    logger.info("Patch Merchandise");


    const { codMercadoria } = req.params;
    const {
      nomeMercadoria,
      embMercadoria,
      fatorMerc,
      complemento,
      barcode,
      marca,
      nego,
      precoUnit,
      precoMercadoria } = req.body;


    const queryUpdate = `
      SET sql_mode = ''; 
      UPDATE mercadoria 
      SET nomeMercadoria = '${nomeMercadoria}', embMercadoria = '${embMercadoria}', fatorMerc = '${fatorMerc}', complemento = '${complemento}', barcode = '${barcode}', marca = '${marca}', nego = '${nego}', precoUnit = '${precoUnit}', precoMercadoria = '${precoMercadoria}'
      WHERE codMercadoria = '${codMercadoria}';`;

    console.log(queryUpdate);

    connection.query(queryUpdate, (error, results, fields) => {
      if (error) {
        console.log("Error Updating Merchandise Negotiation to Provider: ", error);
        return res.status(500).json({ error: 'Erro ao atualizar mercadoria' });
      } else {
        // O resultado da atualização será retornado como parte de results[1]
        console.log(results[1]);
        return res.json(results[1]);
      }
    });
  },

  async getMerchandiseNegotiationProvider(req, res) {
    logger.info("Get Merchandise to Negotiation to Provider");

    const { codprovider, codnegotiation } = req.params;

    const queryConsult = `
    SET sql_mode = ''; select 
    mercadoria.codMercadoria, 
    mercadoria.codFornMerc, 
    concat(mercadoria.codMercadoria_ext," - ", mercadoria.nomeMercadoria) as nomeMercadoria, 
    mercadoria.embMercadoria, 
    mercadoria.complemento, 
    mercadoria.marca, 
    mercadoria.fatorMerc,
    mercadoria.precoUnit,
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
        return res.json(results[1]);
      }
    });
    // connection.end();
  },

  async getMerchandiseClientProviderNegotiation(req, res) {
    logger.info("Get Merchandise to Client Negotiation to Provider");

    const { codclient, codprovider, codnegotiation } = req.params;

    const queryConsult = `
        SET sql_mode = ''; 
  SELECT 
      mercadoria.codMercadoria,
      concat(mercadoria.codMercadoria_ext," - ", mercadoria.nomeMercadoria) as nomeMercadoria,
      mercadoria.embMercadoria,
      mercadoria.fatorMerc,
      mercadoria.complemento,
      mercadoria.marca, 
      IFNULL(SUM(pedido.quantMercPedido), 0) as 'quantMercadoria', 
      mercadoria.precoMercadoria as precoMercadoria,
      mercadoria.precoUnit,
      IFNULL(SUM(mercadoria.precoMercadoria * pedido.quantMercPedido), 0) as 'valorTotal' 
  FROM 
      mercadoria 
  JOIN 
      pedido ON pedido.codMercPedido = mercadoria.codMercadoria 
  WHERE 
      pedido.codAssocPedido = ${codclient}
      AND pedido.codfornpedido =  ${codprovider} 
      AND pedido.codNegoPedido =  ${codnegotiation}  
  GROUP BY 
      mercadoria.codMercadoria
  HAVING 
      valorTotal != 0
  ORDER BY 
      quantMercPedido;
      `;

    connection.query(queryConsult, (error, results, fields) => {
      if (error) {
        console.log("Error Select Merchandise to Client Negotiation to Provider: ", error);
      } else {
        return res.json(results[1]);
      }
    });
    // connection.end();
  },

  async getMerchandiseProvider(req, res) {
    logger.info("Get Merchandise Provider");

    const { codprovider } = req.params;

    const queryConsult = `
    SET sql_mode = ''; select fornecedor.codForn, 
    fornecedor.nomeForn, 
    mercadoria.codMercadoria, 
    concat(mercadoria.codMercadoria_ext," - ", mercadoria.nomeMercadoria) as nomeMercadoria,
    mercadoria.embMercadoria, 
    mercadoria.marca, 
    mercadoria.erpcode,
    mercadoria.barcode,
    mercadoria.nego,                                      
    mercadoria.codMercadoria_ext,                                      
    mercadoria.complemento, 
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
    order by mercadoria.nomeMercadoria  
    asc
`;
    // order by valorTotal
    // desc
    // `;

    connection.query(queryConsult, (error, results, fields) => {
      if (error) {
        console.log("Error Select Merchandise Provider: ", error);
      } else {
        return res.json(results[1]);
      }
    });
    // connection.end();
  },

  async getMerchandiseProviderIfClient(req, res) {
    logger.info("Get Merchandise Provider If Client");

    const { codclient, codprovider, codnegotiation } = req.params;

    const queryConsult =
      "SET sql_mode = ''; select mercadoria.codMercadoria, concat(mercadoria.codMercadoria_ext," -
      ", mercadoria.nomeMercadoria) as nomeMercadoria,mercadoria.complemento, mercadoria.marca, mercadoria.precoUnit, mercadoria.embMercadoria, mercadoria.fatorMerc, mercadoria.precoMercadoria as precoMercadoria, IFNULL(SUM(pedido.quantMercPedido), 0) as quantMercadoria FROM mercadoria left outer JOIN pedido ON(mercadoria.codMercadoria = pedido.codMercPedido) and pedido.codAssocPedido = " +
      codclient +
      " and pedido.codNegoPedido = " +
      codnegotiation +
      " where mercadoria.codFornMerc = " +
      codprovider +
      " GROUP BY mercadoria.codMercadoria ORDER BY quantMercadoria desc";

    connection.query(queryConsult, (error, results, fields) => {
      if (error) {
        console.log("Error Select Merchandise Provider If Client: ", error);
      } else {
        return res.json(results[1]);
      }
    });
    // connection.end();
  },

  async getMerchandiseProviderIfClientLimitNegotiation(req, res) {
    logger.info("Get Merchandise Provider If Client");

    const { codclient, codprovider, codnegotiation } = req.params;

    const queryConsult = `SET sql_mode = ''; select mercadoria.codMercadoria, concat(mercadoria.codMercadoria_ext," - ", mercadoria.nomeMercadoria) as nomeMercadoria,mercadoria.complemento, mercadoria.marca, mercadoria.precoUnit, mercadoria.embMercadoria, mercadoria.fatorMerc, mercadoria.precoMercadoria as precoMercadoria, IFNULL(SUM(pedido.quantMercPedido), 0) as quantMercadoria FROM mercadoria left outer JOIN pedido ON(mercadoria.codMercadoria = pedido.codMercPedido) and pedido.codAssocPedido =  ${codclient}  and pedido.codNegoPedido = ${codnegotiation} where mercadoria.nego = ${codnegotiation} and mercadoria.codFornMerc = ${codprovider} GROUP BY mercadoria.codMercadoria ORDER BY quantMercadoria desc`;

    connection.query(queryConsult, (error, results, fields) => {
      if (error) {
        console.log("Error Select Merchandise Provider If Client: ", error);
      } else {
        return res.json(results[1]);
      }
    });
    // connection.end();
  },

  async getMerchandisePerCustomer(req, res) {
    logger.info("Get Merchandise Provider If Client");

    const { codclient, codeprovider } = req.params;

    const queryConsult = `SET sql_mode = ''; SELECT 
    mercadoria.codMercadoria,
    concat(mercadoria.codMercadoria_ext," - ", mercadoria.nomeMercadoria) as nomeMercadoria,
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
    order by mercadoria.nomeMercadoria  
    asc`;
    // ORDER BY volumeTotal
    // desc`;

    connection.query(queryConsult, (error, results, fields) => {
      if (error) {
        console.log("Error Select Merchandise Provider If Client: ", error);
      } else {
        return res.json(results[1]);
      }
    });
    // connection.end();
  },

  async getMerchandisePerClient(req, res) {
    logger.info("Get Merchandise Provider If Client");

    const { codclient, codeprovider, codenegotiation } = req.params;

    let queryConsult = `SET sql_mode = ''; SELECT 
    mercadoria.codMercadoria,
    concat(mercadoria.codMercadoria_ext," - ", mercadoria.nomeMercadoria) as nomeMercadoria,
    mercadoria.embMercadoria, 
    mercadoria.fatorMerc, 
    mercadoria.marca,
    mercadoria.complemento,
    mercadoria.precoUnit ,
    mercadoria.nego,
    mercadoria.precoMercadoria as precoMercadoria,
    IFNULL(SUM(pedido.quantMercPedido), 0) as volumeTotal 
    FROM mercadoria 
    left outer JOIN pedido ON(mercadoria.codMercadoria = pedido.codMercPedido) 
    and pedido.codAssocPedido = ${codclient}
    where mercadoria.codFornMerc = ${codeprovider}
    and mercadoria.nego = ${codenegotiation}
    GROUP BY mercadoria.codMercadoria
    order by mercadoria.nomeMercadoria  
    asc`;
    if (codclient == 0) {
      queryConsult = `
SET sql_mode = ''; SELECT 
    mercadoria.codMercadoria,
    concat(mercadoria.codMercadoria_ext," - ", mercadoria.nomeMercadoria) as nomeMercadoria,
    mercadoria.embMercadoria, 
    mercadoria.fatorMerc, 
    mercadoria.marca,
    mercadoria.complemento,
    mercadoria.precoUnit ,
    mercadoria.nego,
    mercadoria.precoMercadoria as precoMercadoria,
    IFNULL(SUM(pedido.quantMercPedido), 0) as volumeTotal 
    FROM mercadoria 
    left outer JOIN pedido ON(mercadoria.codMercadoria = pedido.codMercPedido)     
    where mercadoria.codFornMerc = ${codeprovider}
    and mercadoria.nego = ${codenegotiation}
    GROUP BY mercadoria.codMercadoria
    order by mercadoria.nomeMercadoria  
    asc
`;
    }
    connection.query(queryConsult, (error, results, fields) => {
      if (error) {
        console.log("Error Select Merchandise Provider If Client: ", error);
      } else {
        return res.json(results[1]);
      }
    });
    // connection.end();
  },

  async getMerchandiseNegotiationProvider(req, res) {
    logger.info("Get Merchandise Provider If Client");

    const { codprovider, codnegotiation } = req.params;

    const queryConsult = `
    SET sql_mode = ''; SELECT mercadoria.codMercadoria, 
    concat(mercadoria.codMercadoria_ext," - ", mercadoria.nomeMercadoria) as nomeMercadoria, 
    mercadoria.embMercadoria, 
    mercadoria.precoUnit,
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
        return res.json(results[1]);
      }
    });
    // connection.end();
  },

  async postInsertMerchandise(req, res) {
    logger.info("Post Save Merchandise");

    const itens = req.body;

    let params = {
      table: "mercadoria",
      data: itens,
    };
    return Insert(params)
      .then(async (resp) => {
        res.json(resp);
      })
      .catch((error) => {
        res.status(400).send(error);
      });
    connection.end();
  },
};

module.exports = Merchandise;
