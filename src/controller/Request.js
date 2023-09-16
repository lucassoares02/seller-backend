const connection = require("@server");
const logger = require("@logger");
const Select = require("@select");
const Insert = require("@insert");


const Request = {

  async getRequestProviderClient(req, res) {
    logger.info("Get Associate Supliers Orders");

    const { codclient } = req.params;

    const queryConsult = `
    SET sql_mode = ''; select 
      cnpjForn, 
      nomeForn,
      razaoForn, 
      image,
      codForn, 
      IFNULL(sum(mercadoria.precoMercadoria*pedido.quantMercPedido), 0) as 'valorTotal', 
      IFNULL(sum(pedido.quantMercPedido), 0) as 'volumeTotal'
      from fornecedor 
      left join pedido on pedido.codFornPedido = fornecedor.codForn
      left join mercadoria on mercadoria.codMercadoria = pedido.codMercPedido
      where pedido.codAssocPedido = ${codclient} 
      group by pedido.codFornPedido 
      order by sum(mercadoria.precoMercadoria*pedido.quantMercPedido)
      desc`;

    connection.query(queryConsult, (error, results, fields) => {
      if (error) {
        console.log("Error Select Associate Supliers Orders: ", error);
      } else {
        return res.json(results[1]);
      }
    });
    // connection.end();
  },


  async getRequestsProvider(req, res) {
    logger.info("Get Requests Provider");

    const { codprovider } = req.params;

    const queryConsult = `
    SET sql_mode = ''; select pedido.codPedido , 
    associado.cnpjAssociado , 
    associado.codAssociado ,
    consultor.nomeConsult, 
    associado.razaoAssociado, 
    sum(pedido.quantMercPedido * mercadoria.precoMercadoria) as 'valor', 
    TIME_FORMAT(pedido.dataPedido,'%H:%i') as 'horas' 
    from consultor 
    join pedido on consultor.codConsult = pedido.codComprPedido 
    join associado on pedido.codAssocPedido = associado.codAssociado 
    join mercadoria on pedido.codMercPedido = mercadoria.codMercadoria 
    where pedido.codFornPedido = ${codprovider} 
    group by associado.codAssociado 
    order by valor 
    desc
    `;

    connection.query(queryConsult, (error, results, fields) => {
      if (error) {
        console.log("Error Select Requests Provider: ", error);
      } else {
        return res.json(results[1]);
      }
    });
    // connection.end();
  },

  async getRequestsClients(req, res) {
    logger.info("Get Requests Provider");

    const { codconsult } = req.params;

    const queryConsult = `
    SET sql_mode = ''; select pedido.codPedido , 
    associado.cnpjAssociado , 
    associado.codAssociado ,
    consultor.nomeConsult, 
    associado.razaoAssociado, 
    sum(pedido.quantMercPedido * mercadoria.precoMercadoria) as 'valor', 
    TIME_FORMAT(pedido.dataPedido,'%H:%i') as 'horas' 
    from consultor 
    join pedido on consultor.codConsult = pedido.codComprPedido 
    join associado on pedido.codAssocPedido = associado.codAssociado 
    join mercadoria on pedido.codMercPedido = mercadoria.codMercadoria 
    where consultor.codConsult  = ${codconsult} 
    group by associado.codAssociado 
    order by valor 
    desc
    `;

    connection.query(queryConsult, (error, results, fields) => {
      if (error) {
        console.log("Error Select Requests Provider: ", error);
      } else {
        return res.json(results[1]);
      }
    });
    // connection.end();
  },


  async getAllRequests(req, res) {
    logger.info("Get All Requests");

    const { codprovider } = req.params;

    const queryConsult = `
    SET sql_mode = ''; select 
    pedido.codPedido ,
    associado.cnpjAssociado ,
    associado.codAssociado ,
    consultor.nomeConsult,
    pedido.codFornPedido,
    associado.razaoAssociado,
    sum(pedido.quantMercPedido * mercadoria.precoMercadoria) as 'valor',
    TIME_FORMAT(pedido.dataPedido,'%H:%i') as 'horas' 
    from consultor 
    join pedido on consultor.codConsult = pedido.codComprPedido 
    join associado on pedido.codAssocPedido = associado.codAssociado 
    join mercadoria on pedido.codMercPedido = mercadoria.codMercadoria
    group by associado.codAssociado 
    order by valor 
    desc`;

    connection.query(queryConsult, (error, results, fields) => {
      if (error) {
        console.log("Error Select All Requests: ", error);
      } else {
        return res.json(results[1]);
      }
    });
    // connection.end();
  },

  // async postInserRequestNew(req, res) {
  //   logger.info("Get All Requests");

  //   const { codMercadoria, quantMercadoria, codFornecedor, codAssociado, codComprador, codNegociacao, codOrganizacao } = req.body;


  //   const queryConsult = `INSERT INTO pedido (codMercPedido, codNegoPedido, codAssocPedido, codFornPedido, codComprPedido, quantMercPedido, codOrganizador)
  //   VALUES (${codMercadoria}, ${codNegociacao}, ${codAssociado},  ${codFornecedor}, ${codComprador}, ${quantMercadoria}, ${codOrganizacao})
  //   ON DUPLICATE KEY UPDATE quantMercPedido = VALUES(quantMercPedido);`;

  //   connection.query(queryConsult, (error, results, fields) => {
  //     if (error) {
  //       console.log("Error Select All Requests: ", error);
  //     } else {
  //       return res.json(results[1]);
  //     }
  //   });
  //   // connection.end();
  // },



  async postInserRequestNew(req, res) {
    logger.info("Get All Requests");

    const { codAssociado, codFornecedor, codComprador, codNegociacao, codOrganizacao, items } = req.body;


    let values = "";
    for (let i = 0; i < items.length; i++) {
      console.log(items[i]["codMercadoria"]);
      values = values + `(${items[i]["codMercadoria"]}, ${codNegociacao}, ${codAssociado},  ${codFornecedor}, ${codComprador}, ${items[i]["quantMercadoria"]}, ${codOrganizacao})`;
      values = values + (i == items.length - 1 ? " " : ",");
    }


    const queryConsult = "INSERT INTO pedido (codMercPedido, codNegoPedido, codAssocPedido, codFornPedido, codComprPedido, quantMercPedido, codOrganizador) VALUES" + values + "ON DUPLICATE KEY UPDATE quantMercPedido = VALUES(quantMercPedido);";

    console.log("==================================");
    console.log(queryConsult);
    console.log("==================================");

    connection.query(queryConsult, (error, results, fields) => {
      if (error) {
        console.log(error);
        console.log("Error Select All Requests: ", error);
      } else {
        return res.json(results[1]);
      }
    });
    return 0;
    // connection.end();
  },



  async postInsertRequest(req, res) {
    logger.info("Post Insert Request");

    const { codMercadoria, quantMercadoria, codFornecedor, codAssociado, codComprador, codNegociacao, codOrganizacao } = req.body;


    const queryConsult = "SET sql_mode = ''; select quantMercPedido from pedido where codMercPedido = " + codMercadoria + " and codAssocPedido = " + codAssociado + " and codNegoPedido =  " + codNegociacao + " group by quantMercPedido";

    connection.query(queryConsult, async (error, results, fields) => {
      if (error) {
        return ("Error Insert Request: ", error);
      } else {

        if (results == "") {
          // Insert
          const queryInsert = "INSERT INTO pedido (codFornPedido , codAssocPedido, codComprPedido, codMercPedido, quantMercPedido, codOrganizador, codNegoPedido) VALUES (" + codFornecedor + ", " + codAssociado + ", " + codComprador + ", " + codMercadoria + ", " + quantMercadoria + ", " + codOrganizacao + " ," + codNegociacao + " )";

          connection.query(queryInsert, (error, results) => {
            if (error) {
              return ("Error Insert Request Client: ", error);
            } else {
              return res.json(results[1]);
            }
          });

        } else {
          // Update
          const queryUpdate = "UPDATE pedido SET quantMercPedido = " + quantMercadoria + " where codMercPedido = " + codMercadoria + " and codAssocPedido = " + codAssociado + " and codNegoPedido = " + codNegociacao;

          connection.query(queryUpdate, (error, results) => {
            if (error) {
              return ("Error Update Request Client: ", error);
            } else {
              return res.json(results[1]);
            }
          });
        }
      };
      return 0;
    });
    // connection.end();
  },





};

module.exports = Request;


