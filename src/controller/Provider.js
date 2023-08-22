const connection = require("@server");
const logger = require("@logger");
const Select = require("@select");
const Insert = require("@insert");

const Provider = {

  async getProviderClient(req, res) {
    logger.info("Get Provider Client");

    const { codconsultor } = req.params;

    const queryConsult = "select cnpjForn, nomeForn, razaoForn, codForn, FORMAT(IFNULL(sum(mercadoria.precoMercadoria*pedido.quantMercPedido), 0), 2, 'de_DE') as 'valorTotal', IFNULL(sum(pedido.quantMercPedido), 0) as 'volumeTotal' from relaciona join pedido on pedido.codAssocPedido = relaciona.codConsultRelaciona join fornecedor on fornecedor.codForn = pedido.codFornPedido left join mercadoria on mercadoria.codMercadoria = pedido.codMercPedido where relaciona.codAssocRelaciona =" + codconsultor + " group by fornecedor.codForn order by valorTotal desc";

    connection.query(queryConsult, (error, results, fields) => {
      if (error) {
        console.log("Error Select Provider Client: ", error);
      } else {
        return res.json(results);
      }
    });
    // connection.end();
  },

  async getProviderSells(req, res) {
    logger.info("Get Provider Sells");

    const queryConsult = `
    select 
    cnpjForn,
    nomeForn, 
    razaoForn as razao, 
    codForn, 
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
        return res.json(results);
      }
    });
    // connection.end();
  },


  async getProvidersCategories(req, res) {
    logger.info("Get Providers Categories");

    const { codbuyer } = req.params;

    const queryConsult = `
    select 
    cnpjForn, 
    nomeForn,
    razaoForn as razao, 
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
        return res.json(results);
      }
    });
    // connection.end();
  },


  async getProvidersClient(req, res) {
    logger.info("Get Providers Client");

    const { codconsultclient } = req.params;

    const queryConsult = `
    select cnpjForn, 
    nomeForn, 
    razaoForn, 
    codForn, 
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
        return res.json(results);
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
        return res.json(results);
      }
    });
    // connection.end();
  },


  async getProviderConsult(req, res) {
    logger.info("Get Provider Consult");

    const { codconsult } = req.params;

    const queryConsult = "select cnpjForn, nomeForn, razaoForn, codForn, FORMAT(IFNULL(sum(mercadoria.precoMercadoria*pedido.quantMercPedido), 0), 2, 'de_DE') as 'valorTotal', IFNULL(sum(pedido.quantMercPedido), 0) as 'volumeTotal' from fornecedor join relacionafornecedor on relacionafornecedor.codFornecedor = fornecedor.codForn left join pedido on pedido.codFornPedido = relacionafornecedor.codFornecedor left join mercadoria on mercadoria.codMercadoria = pedido.codMercPedido where relacionafornecedor.codConsultor = " + codconsult + " group by fornecedor.codForn order by sum(mercadoria.precoMercadoria*pedido.quantMercPedido) desc";

    connection.query(queryConsult, (error, results, fields) => {
      if (error) {
        console.log("Error Select Provider Consult: ", error);
      } else {
        return res.json(results);
      }
    });
    // connection.end();
  },

};

module.exports = Provider;
