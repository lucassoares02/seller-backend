const { connection } = require("@server");
const logger = require("@logger");
const Select = require("@select");
const Insert = require("@insert");
const axios = require('axios');

const Request = {
  async getRequestProviderClient(req, res) {
    logger.info("Get Associate Supliers Orders");

    const { codclient } = req.params;

    const queryConsult = `
    SET sql_mode = ''; select cnpjForn, 
    nomeForn,
    razaoForn as razao, 
    codForn, 
    image,
    color,
    IFNULL(sum(mercadoria.precoMercadoria*pedido.quantMercPedido), 0) as 'valorTotal', 
    IFNULL(sum(pedido.quantMercPedido), 0) as 'volumeTotal'
    from fornecedor 
    left join pedido on pedido.codFornPedido = fornecedor.codForn
    left join mercadoria on mercadoria.codMercadoria = pedido.codMercPedido 
    and pedido.codAssocPedido = ${codclient}
    group by fornecedor.codForn
    order by sum(mercadoria.precoMercadoria*pedido.quantMercPedido) 
    desc`;
    // const queryConsult = `
    // SET sql_mode = ''; select
    //   cnpjForn,
    //   nomeForn,
    //   razaoForn,
    //   image,
    //   codForn,
    //   color,
    //   IFNULL(sum(mercadoria.precoMercadoria*pedido.quantMercPedido), 0) as 'valorTotal',
    //   IFNULL(sum(pedido.quantMercPedido), 0) as 'volumeTotal'
    //   from fornecedor
    //   left join pedido on pedido.codFornPedido = fornecedor.codForn
    //   left join mercadoria on mercadoria.codMercadoria = pedido.codMercPedido
    //   where pedido.codAssocPedido = ${codclient}
    //   group by pedido.codFornPedido
    //   order by sum(mercadoria.precoMercadoria*pedido.quantMercPedido)
    //   desc`;

    connection.query(queryConsult, (error, results, fields) => {
      if (error) {
        console.log("Error Select Associate Supliers Orders: ", error);
      } else {
        return res.json(results[1]);
      }
    });
    // connection.end();
  },

  async getRequestTopProviderClient(req, res) {
    logger.info("Get Top Providers per Client");

    const { codclient } = req.params;

    const queryConsult = `
    SET sql_mode = ''; select 
      cnpjForn, 
      nomeForn,
      razaoForn, 
      image,
      codForn, 
      color,
      IFNULL(sum(mercadoria.precoMercadoria*pedido.quantMercPedido), 0) as 'valorTotal', 
      IFNULL(sum(pedido.quantMercPedido), 0) as 'volumeTotal'
      from fornecedor 
      left join pedido on pedido.codFornPedido = fornecedor.codForn
      left join mercadoria on mercadoria.codMercadoria = pedido.codMercPedido
      where pedido.codAssocPedido = ${codclient} 
      group by pedido.codFornPedido 
      order by sum(mercadoria.precoMercadoria*pedido.quantMercPedido)
      desc
      `;

    connection.query(queryConsult, (error, results, fields) => {
      if (error) {
        console.log("Error Select Top Providers per Client: ", error);
      } else {
        return res.json(results[1]);
      }
    });
    // connection.end();
  },

  async getRequestNegotiationProviderClient(req, res) {
    logger.info("Get Top Providers per Client");

    const { codclient, codprovider } = req.params;

    const queryConsult = `SET sql_mode = ''; select 
      n.codNegociacao,      
      n.descNegociacao,
      n.observacao,
      n.prazo,
      IFNULL(sum(mercadoria.precoMercadoria*pedido.quantMercPedido), 0) as 'valorTotal', 
      IFNULL(sum(pedido.quantMercPedido), 0) as 'volumeTotal'
      from fornecedor 
      left join pedido on pedido.codFornPedido = fornecedor.codForn
      left join mercadoria on mercadoria.codMercadoria = pedido.codMercPedido
      join negociacao n on n.codNegociacao = pedido.codNegoPedido
      where pedido.codAssocPedido = ${codclient} and pedido.codFornPedido = ${codprovider}
      group by pedido.codNegoPedido 
      order by sum(mercadoria.precoMercadoria*pedido.quantMercPedido)
      desc`;

    connection.query(queryConsult, (error, results, fields) => {
      if (error) {
        console.log("Error Select Top Providers per Client: ", error);
      } else {
        return res.json(results[1]);
      }
    });
    // connection.end();
  },
  async getRequestNegotiationsPerProvider(req, res) {
    logger.info("Get Top Providers per Client");

    const { codprovider } = req.params;

    const queryConsult = `SET sql_mode = ''; select 
      n.codNegociacao,      
      n.descNegociacao,
      n.observacao,
      n.prazo,
      IFNULL(sum(mercadoria.precoMercadoria*pedido.quantMercPedido), 0) as 'valorTotal', 
      IFNULL(sum(pedido.quantMercPedido), 0) as 'volumeTotal'
      from fornecedor 
      left join pedido on pedido.codFornPedido = fornecedor.codForn
      left join mercadoria on mercadoria.codMercadoria = pedido.codMercPedido
      join negociacao n on n.codNegociacao = pedido.codNegoPedido
      where pedido.codFornPedido = ${codprovider}
      group by pedido.codNegoPedido 
      order by sum(mercadoria.precoMercadoria*pedido.quantMercPedido)
      desc`;

    connection.query(queryConsult, (error, results, fields) => {
      if (error) {
        console.log("Error Select Top Providers per Client: ", error);
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
    pedido.codConsultPedido,
    associado.razaoAssociado, 
    sum(pedido.quantMercPedido * mercadoria.precoMercadoria) as 'valor', 
    TIME_FORMAT(SUBTIME(pedido.dataPedido, '03:00:00'),'%H:%i') as 'horas' 
    from consultor 
    join pedido on consultor.codConsult = pedido.codComprPedido 
    join associado on pedido.codAssocPedido = associado.codAssociado 
    join mercadoria on pedido.codMercPedido = mercadoria.codMercadoria 
    where pedido.codFornPedido = ${codprovider} 
    group by associado.codAssociado 
    order by horas 
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


  async ExportClientsPerProvider(req, res) {
    logger.info("Get Export Negotiation ");

    console.log(req.params);

    const { provider } = req.params;


    const queryConsult = `
    SET sql_mode = ''; 
    select  
    associado.cnpjAssociado as cnpj, 
    associado.codAssociado as 'codigo',
    consultor.nomeConsult as 'responsavel', 
    associado.razaoAssociado as 'razao', 
    fornecedor.codForn as 'codigo_fornecedor', 
    fornecedor.razaoForn as 'fornecedor',
    IFNULL(sum(pedido.quantMercPedido), 0) as 'volume',
    format(sum(pedido.quantMercPedido * mercadoria.precoMercadoria), 2, 'de_DE') as 'valor', 
    TIME_FORMAT(SUBTIME(pedido.dataPedido, '03:00:00'),'%H:%i') as 'horas' 
    from consultor 
    join pedido on consultor.codConsult = pedido.codComprPedido 
    join associado on pedido.codAssocPedido = associado.codAssociado 
    join mercadoria on pedido.codMercPedido = mercadoria.codMercadoria 
    join fornecedor on fornecedor.codForn = pedido.codFornPedido
    where pedido.codFornPedido = ${provider}
    group by associado.codAssociado 
    order by valor
    desc`;

    connection.query(queryConsult, (error, results, fields) => {
      try {
        if (error) {
          console.log("Error Export Negotiation : ", error);
        } else {
          if (results.length > 0) {
            let csvData = `Codigo Associado;Razão Associado;CNPJ;Responsável;Volume Total;Valor Total\n`;

            csvData += results[1]
              .map((row) => {
                return ` ${row.codigo};"${row.razao}";"${row.cnpj}";"${row.responsavel}";"${row.volume}";"${row.valor}"`; // Substitua com os nomes das colunas do seu banco de dados
              })
              .join("\n");


            const dateNow = Date.now();

            // Configurar os cabeçalhos de resposta para fazer o download
            res.setHeader(
              "Content-Disposition",
              `attachment; filename=${results[1][0].codigo_fornecedor}_${results[1][0].fornecedor.replaceAll(" ", "_").toLowerCase()}_geral.csv`
            );
            res.setHeader("Content-Type", "text/csv");

            // Transmitir o arquivo CSV como resposta
            return res.send(csvData);
          }

          return res.send({ Message: "Sem pedidos" });

          // return res.json(results[1]);
        }
      } catch (error) {
        return res.send({ Mensagem: "Essa loja não possuí pedidos para exportar!" });
      }
    });
    // connection.end();
  },

  async getRequestsNegotiation(req, res) {
    logger.info("Get Requests Negotiation");

    const { codenegotiation } = req.params;

    const queryConsult = `
    SET sql_mode = ''; select pedido.codPedido , 
    associado.cnpjAssociado , 
    associado.codAssociado ,
    consultor.nomeConsult, 
    pedido.codConsultPedido,
       pedido.codNegoPedido,
    associado.razaoAssociado, 
    sum(pedido.quantMercPedido * mercadoria.precoMercadoria) as 'valor', 
    TIME_FORMAT(SUBTIME(pedido.dataPedido, '03:00:00'),'%H:%i') as 'horas' 
    from consultor 
    join pedido on consultor.codConsult = pedido.codComprPedido 
    join associado on pedido.codAssocPedido = associado.codAssociado 
    join mercadoria on pedido.codMercPedido = mercadoria.codMercadoria 
    where pedido.codNegoPedido = ${codenegotiation}
    group by associado.codAssociado 
    order by horas 
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

  async getRequestsClientsWithNegotiation(req, res) {
    logger.info("Get Requests Provider");

    const { codebranch } = req.params;

    const queryConsult = `
    SET sql_mode = ''; select pedido.codPedido , 
    associado.cnpjAssociado , 
    associado.codAssociado  as codConsultRelaciona,
    consultor.nomeConsult, 
    associado.razaoAssociado, 
    fornecedor.nomeForn,
    fornecedor.codForn,
    negociacao.codNegociacao,
    negociacao.descNegociacao,
    sum(pedido.quantMercPedido * mercadoria.precoMercadoria) as 'valor', 
    TIME_FORMAT(SUBTIME(pedido.dataPedido, '03:00:00'),'%H:%i') as 'horas' 
    from consultor 
    join pedido on consultor.codConsult = pedido.codComprPedido 
    join fornecedor on fornecedor.codForn = pedido.codFornPedido
    join negociacao on negociacao.codNegociacao = pedido.codNegoPedido
    join associado on pedido.codAssocPedido = associado.codAssociado 
    join mercadoria on pedido.codMercPedido = mercadoria.codMercadoria 
    where pedido.codAssocPedido = ${codebranch} 
    group by pedido.codNegoPedido
    order by horas 
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
    TIME_FORMAT(SUBTIME(pedido.dataPedido, '03:00:00'),'%H:%i') as 'horas' 
    from consultor 
    join pedido on consultor.codConsult = pedido.codComprPedido 
    join associado on pedido.codAssocPedido = associado.codAssociado 
    join mercadoria on pedido.codMercPedido = mercadoria.codMercadoria 
    where consultor.codConsult  = ${codconsult} 
    group by associado.codAssociado 
    order by horas
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

    // const queryConsult = `
    // SET sql_mode = ''; select
    // pedido.codPedido ,
    // associado.cnpjAssociado ,
    // associado.codAssociado ,
    // consultor.nomeConsult,
    // pedido.codFornPedido,
    // associado.razaoAssociado,
    // sum(pedido.quantMercPedido * mercadoria.precoMercadoria) as 'valor',
    // TIME_FORMAT(SUBTIME(pedido.dataPedido, '03:00:00'), '%H:%i') as 'horas'
    // from consultor
    // join pedido on consultor.codConsult = pedido.codComprPedido
    // join associado on pedido.codAssocPedido = associado.codAssociado
    // join mercadoria on pedido.codMercPedido = mercadoria.codMercadoria
    // group by associado.codAssociado
    // order by horas
    // desc`;
    const queryConsult = `
    SET sql_mode = ''; select pedido.codPedido , 
    associado.cnpjAssociado , 
    associado.codAssociado  as codConsultRelaciona,
    consultor.nomeConsult, 
    associado.razaoAssociado, 
    fornecedor.nomeForn,
    fornecedor.codForn,
    negociacao.codNegociacao,
    negociacao.descNegociacao,
    sum(pedido.quantMercPedido * mercadoria.precoMercadoria) as 'valor', 
    TIME_FORMAT(SUBTIME(pedido.dataPedido, '03:00:00'),'%H:%i') as 'horas' 
    from consultor 
    join pedido on consultor.codConsult = pedido.codComprPedido 
    join fornecedor on fornecedor.codForn = pedido.codFornPedido
    join negociacao on negociacao.codNegociacao = pedido.codNegoPedido
    join associado on pedido.codAssocPedido = associado.codAssociado 
    join mercadoria on pedido.codMercPedido = mercadoria.codMercadoria 
    group by associado.codAssociado, fornecedor.codForn
    order by horas 
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

  //   console.log(req.body);

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
    logger.info("POST INSERT REQUEST NEW");

    logger.info("1");


    const { codAssociado, codFornecedor, codComprador, codNegociacao, codOrganizacao, items, codeConsult } = req.body;

    logger.info("2");

    // try {
    //   if (process.env.INDEX_API == 0) {
    //     axios.post(`${process.env.API_BACKUP}/insertrequestnew`, {
    //       "codAssociado": codAssociado,
    //       "codFornecedor": codFornecedor,
    //       "codComprador": codComprador,
    //       "codNegociacao": codNegociacao,
    //       "codeConsult": codeConsult,
    //       "codOrganizacao": codOrganizacao,
    //       "items": items
    //     });
    //   }
    // } catch (error) {
    //   logger.error(`Error Backup Save: ${error}`);
    // }

    let values = "";

    logger.info("3");

    for (let i = 0; i < items.length; i++) {
      values =
        values +
        `(${items[i]["codMercadoria"]}, ${codNegociacao}, ${codAssociado},  ${codFornecedor}, ${codeConsult}, ${codComprador}, ${items[i]["quantMercadoria"]}, ${codOrganizacao})`;
      values = values + (i == items.length - 1 ? " " : ",");
    }

    logger.info("4");

    const queryConsult =
      "INSERT INTO pedido (codMercPedido, codNegoPedido, codAssocPedido, codFornPedido, codConsultPedido, codComprPedido, quantMercPedido, codOrganizador) VALUES" +
      values +
      "ON DUPLICATE KEY UPDATE quantMercPedido = VALUES(quantMercPedido); SHOW WARNINGS";

    logger.info("5");

    console.log("==================================");
    console.log(queryConsult);
    console.log("==================================");

    logger.info("6");

    connection.query(queryConsult, (error, results, fields) => {
      if (error) {
        console.log(error);
        console.log("Error Select All Requests: ", error);
      } else {
        console.log(results);
        console.log("results");
        console.log(results[1]);
        logger.info("7");
        return res.json(results[1]);
      }
    });
    return 0;
    // connection.end();
  },

  async postInsertRequest(req, res) {
    logger.info("Post Insert Request");

    const { codMercadoria, quantMercadoria, codFornecedor, codAssociado, codComprador, codNegociacao, codOrganizacao } = req.body;

    const queryConsult =
      "SET sql_mode = ''; select quantMercPedido from pedido where codMercPedido = " +
      codMercadoria +
      " and codAssocPedido = " +
      codAssociado +
      " and codNegoPedido =  " +
      codNegociacao +
      " group by quantMercPedido";

    connection.query(queryConsult, async (error, results, fields) => {
      if (error) {
        return "Error Insert Request: ", error;
      } else {
        if (results == "") {
          // Insert
          const queryInsert =
            "INSERT INTO pedido (codFornPedido , codAssocPedido, codComprPedido, codMercPedido, quantMercPedido, codOrganizador, codNegoPedido) VALUES (" +
            codFornecedor +
            ", " +
            codAssociado +
            ", " +
            codComprador +
            ", " +
            codMercadoria +
            ", " +
            quantMercadoria +
            ", " +
            codOrganizacao +
            " ," +
            codNegociacao +
            " )";

          connection.query(queryInsert, (error, results) => {
            if (error) {
              return "Error Insert Request Client: ", error;
            } else {
              return res.json(results[1]);
            }
          });
        } else {
          // Update
          const queryUpdate =
            "UPDATE pedido SET quantMercPedido = " +
            quantMercadoria +
            " where codMercPedido = " +
            codMercadoria +
            " and codAssocPedido = " +
            codAssociado +
            " and codNegoPedido = " +
            codNegociacao;

          connection.query(queryUpdate, (error, results) => {
            if (error) {
              return "Error Update Request Client: ", error;
            } else {
              return res.json(results[1]);
            }
          });
        }
      }
      return 0;
    });
    // connection.end();
  },
};

module.exports = Request;
