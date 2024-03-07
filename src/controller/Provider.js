const connection = require("@server");
const logger = require("@logger");
const Select = require("@select");
const Insert = require("@insert");

const Provider = {
  async getProviderClient(req, res) {
    logger.info("Get Provider Client");

    const { codconsultor } = req.params;

    const queryConsult =
      "SET sql_mode = ''; select cnpjForn, nomeForn, razaoForn, codForn, image, FORMAT(IFNULL(sum(mercadoria.precoMercadoria*pedido.quantMercPedido), 0), 2, 'de_DE') as 'valorTotal', IFNULL(sum(pedido.quantMercPedido), 0) as 'volumeTotal' from relaciona join pedido on pedido.codAssocPedido = relaciona.codConsultRelaciona join fornecedor on fornecedor.codForn = pedido.codFornPedido left join mercadoria on mercadoria.codMercadoria = pedido.codMercPedido where relaciona.codAssocRelaciona =" +
      codconsultor +
      " group by fornecedor.codForn order by valorTotal desc";

    connection.query(queryConsult, (error, results, fields) => {
      if (error) {
        console.log("Error Select Provider Client: ", error);
      } else {
        return res.json(results[1]);
      }
    });
    // connection.end();
  },

  async getProviderSells(req, res) {
    logger.info("Get Provider Sells");

    const queryConsult = `
    SET sql_mode = ''; select 
    cnpjForn,
    nomeForn, 
    razaoForn as razao, 
    codForn, 
    image,
    IFNULL(sum(mercadoria.precoMercadoria * pedido.quantMercPedido), 0) as 'valorTotal',
    IFNULL(sum(pedido.quantMercPedido), 0) as 'volumeTotal'
    from fornecedor 
    left join pedido on pedido.codFornPedido = fornecedor.codForn 
    left join mercadoria on mercadoria.codMercadoria = pedido.codMercPedido 
    group by fornecedor.codForn 
    order by sum(mercadoria.precoMercadoria * pedido.quantMercPedido)
    desc`;

    connection.query(queryConsult, (error, results, fields) => {
      if (error) {
        console.log("Error Select Provider Sells: ", error);
      } else {
        return res.json(results[1]);
      }
    });
    // connection.end();
  },

  async getProvidersCategories(req, res) {
    logger.info("Get Providers Categories");

    const { codbuyer } = req.params;

    const queryConsult = `
    SET sql_mode = ''; select 
    cnpjForn, 
    nomeForn,
    razaoForn as razao, 
    image,
    codForn, 
    IFNULL(sum(mercadoria.precoMercadoria*pedido.quantMercPedido), 0) as 'valorTotal',
    IFNULL(sum(pedido.quantMercPedido),0) as 'volumeTotal'
    from fornecedor 
    join comprador on comprador.codCompr = fornecedor.codComprFornecedor
    left join pedido on pedido.codFornPedido = fornecedor.codForn 
    left join mercadoria on mercadoria.codMercadoria = pedido.codMercPedido
    where comprador.codCompr = ${codbuyer}
    group by fornecedor.codForn 
    order by sum(mercadoria.precoMercadoria*pedido.quantMercPedido) 
    desc`;

    connection.query(queryConsult, (error, results, fields) => {
      if (error) {
        console.log("Error Select Providers Categories: ", error);
      } else {
        return res.json(results[1]);
      }
    });
    // connection.end();
  },

  async getProvidersClient(req, res) {
    logger.info("Get Providers Client");

    const { codconsultclient } = req.params;

    const queryConsult = `
    SET sql_mode = ''; select cnpjForn, 
    nomeForn,
    razaoForn as razao, 
    codForn, 
    image,
    IFNULL(sum(mercadoria.precoMercadoria*pedido.quantMercPedido), 0) as 'valorTotal', 
    IFNULL(sum(pedido.quantMercPedido), 0) as 'volumeTotal'
    from fornecedor 
    left join pedido on pedido.codFornPedido = fornecedor.codForn
    left join relaciona on relaciona.codConsultRelaciona = pedido.codAssocPedido 
    left join mercadoria on mercadoria.codMercadoria = pedido.codMercPedido 
    and relaciona.codAssocRelaciona = ${codconsultclient}
    group by fornecedor.codForn 
    order by sum(mercadoria.precoMercadoria*pedido.quantMercPedido) 
    desc`;

    connection.query(queryConsult, (error, results, fields) => {
      if (error) {
        console.log("Error Select Providers Client: ", error);
      } else {
        return res.json(results[1]);
      }
    });
    // connection.end();
  },

  async getAllProviders(req, res) {
    logger.info("Get All Providers");

    const queryConsult = "";

    connection.query(queryConsult, (error, results, fields) => {
      if (error) {
        console.log("Error Select All Providers: ", error);
      } else {
        return res.json(results[1]);
      }
    });
    // connection.end();
  },

  async getProviderConsult(req, res) {
    logger.info("Get Provider Consult");

    const { codconsult } = req.params;

    const queryConsult =
      "SET sql_mode = ''; select cnpjForn, nomeForn, razaoForn, image, codForn, FORMAT(IFNULL(sum(mercadoria.precoMercadoria*pedido.quantMercPedido), 0), 2, 'de_DE') as 'valorTotal', IFNULL(sum(pedido.quantMercPedido), 0) as 'volumeTotal' from fornecedor join relacionafornecedor on relacionafornecedor.codFornecedor = fornecedor.codForn left join pedido on pedido.codFornPedido = relacionafornecedor.codFornecedor left join mercadoria on mercadoria.codMercadoria = pedido.codMercPedido where relacionafornecedor.codConsultor = " +
      codconsult +
      " group by fornecedor.codForn order by sum(mercadoria.precoMercadoria*pedido.quantMercPedido) desc";

    connection.query(queryConsult, (error, results, fields) => {
      if (error) {
        console.log("Error Select Provider Consult: ", error);
      } else {
        return res.json(results[1]);
      }
    });
    // connection.end();
  },

  async getProviderDetails(req, res) {
    logger.info("Get Provider Consult");

    const { codforn } = req.params;

    const queryConsult = `select * from fornecedor
    join consultor on consultor.codFornConsult = fornecedor.codForn
    where codForn = ${codforn}`;

    connection.query(queryConsult, (error, results, fields) => {
      if (error) {
        return res.status(400).send(error);
      } else {
        return res.json(results[1]);
      }
    });
    // connection.end();
  },

  async postInsertProvider(req, res) {
    logger.info("Post Insert Provider");

    const { codForn, nomeForn, razaoForn, cnpjForn, telForn, type, categoria, codComprFornecedor, image } = req.body;

    let queryInsert = "";

    if (type == 1) {
      queryInsert = `INSERT INTO 
      fornecedor 
      (codForn, nomeForn, razaoForn, cnpjForn, telForn, codCategoria, codComprFornecedor, image) 
      VALUES (${codForn}, '${nomeForn}', '${razaoForn}', '${cnpjForn}', '${telForn}', '${categoria}', ${codComprFornecedor}, ${image})`;
    } else if (type == 2) {
      queryInsert = `INSERT INTO 
      associado 
      (codAssociado, razaoAssociado, cnpjAssociado) 
      VALUES (${codForn}, '${nomeForn}', '${razaoForn}')`;
    } else if (type == 3) {
      queryInsert = `INSERT INTO 
      organizador 
      (codOrg, nomeOrg, razaoOrg, cnpjOrg, telOrg, emailOrg) 
      VALUES (${codForn}, '${nomeForn}', '${razaoForn}', '${cnpjForn}', '${telForn}', 'contato@profair')`;
    }

    connection.query(queryInsert, (error, results) => {
      if (error) {
        return res.status(400).send(error);
      } else {
        return res.status(200).send(`message: Save Success!`);
      }
    });

    // connection.end();
  },
};

module.exports = Provider;
