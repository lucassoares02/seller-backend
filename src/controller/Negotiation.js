const connection = require("@server");
const logger = require("@logger");
const Select = require("@select");
const Insert = require("@insert");

const Negotiation = {

  async getAllNegotiation(req, res) {
    logger.info("Get All Negotiations");

    const queryConsult = "SET sql_mode = ''; select relaciona.codAssocRelaciona, consultor.nomeConsult, relaciona.codConsultRelaciona, associado.razaoAssociado,  associado.cnpjAssociado, FORMAT(COALESCE(sum(mercadoria.precoMercadoria*pedido.quantMercPedido),'0'), 2, 'de_DE') as 'valorTotal', sum(pedido.quantMercPedido) as 'volumeTotal' from associado join relaciona on relaciona.codConsultRelaciona = associado.codAssociado join consultor on consultor.codConsult = relaciona.codAssocRelaciona left join pedido on pedido.codAssocPedido = relaciona.codConsultRelaciona left join mercadoria on codMercadoria = pedido.codMercPedido group by relaciona.codConsultRelaciona order by sum(mercadoria.precoMercadoria*pedido.quantMercPedido) desc";

    connection.query(queryConsult, (error, results, fields) => {
      if (error) {
        console.log("Error Select Users: ", error);
      } else {
        return res.json(results[1]);
      }
    });
    // connection.end();
  },



  async getNegotiationProvider(req, res) {
    logger.info("Get Negotiation Provider");

    const { codforn } = req.params;


    const queryConsult = "SET sql_mode = ''; select negociacao.codNegociacao, negociacao.descNegociacao, negociacao.codFornNegociacao, FORMAT(IFNULL(sum(mercadoria.precoMercadoria*pedido. quantMercPedido),0), 2, 'de_DE') as 'valorTotal', IFNULL(sum(pedido.quantMercPedido),0) as 'volumeTotal' from negociacao left join pedido on pedido.codNegoPedido = negociacao.codNegociacao left join mercadoria on mercadoria.codMercadoria = pedido.codMercPedido where negociacao.codFornNegociacao = " + codforn + " group by negociacao.codNegociacao order by sum(mercadoria.precoMercadoria*pedido.quantMercPedido) desc";


    connection.query(queryConsult, (error, results, fields) => {
      if (error) {
        console.log("Error Select Negotiation Provider: ", error);
      } else {
        return res.json(results[1]);
      }
    });
    // connection.end();
  },

  async GetExportNegotiations(req, res) {
    logger.info("Get Export Negotiation ");

    const { codforn } = req.params;


    const queryConsult = `
    SET sql_mode = ''; select
      p.codMercPedido,
      m.nomeMercadoria,
      m.complemento,
      m.barcode,
      m.erpcode,
      m.marca,
      p.quantMercPedido as quantidade,
      p.codFornPedido,
      p.codAssocPedido,
      p.codNegoPedido ,
      p.codMercPedido
      from pedido p
      join mercadoria m 
      where m.codMercadoria = p.codMercPedido 
      order by p.codNegoPedido;`;


    connection.query(queryConsult, (error, results, fields) => {
      if (error) {
        console.log("Error Export Negotiation : ", error);
      } else {

        let csvData = `ID;Negociacao;Codigo ERP;Codigo de barras;Produto;Complemento;Valor;Valor (NF unitario);Valor (NF embalagem);Tipo Embalagem;Qtde. Embalagem;Qtde. Minima;Modalidade;Data inicio encarte;Data fim encarte;Termino negociacao;Marca;Estoque;Quantidade\n`;

        csvData += results[1].map((row) => {
          return ` ${row.codMercPedido};${row.codNegoPedido};${row.erpcode};${row.barcode};${row.nomeMercadoria};${row.complemento};;;;;;;;;;;${row.marca};;${row.quantidade}`; // Substitua com os nomes das colunas do seu banco de dados



        }).join('\n');

        const dateNow = Date.now();

        // Configurar os cabeçalhos de resposta para fazer o download
        res.setHeader('Content-Disposition', `attachment; filename=${dateNow}_negociacoes.csv`);
        res.setHeader('Content-Type', 'text/csv');

        // Transmitir o arquivo CSV como resposta
        return res.send(csvData);


        // return res.json(results[1]);
      }
    });
    // connection.end();
  },


  async GetExportNegotiationsClient(req, res) {
    logger.info("Get Export Negotiation ");

    const { codeclient } = req.params;


    const queryConsult = `
    SET sql_mode = ''; select
      p.codMercPedido,
      m.nomeMercadoria,
      m.complemento,
      m.barcode,
      m.erpcode,
      m.marca,
      p.quantMercPedido as quantidade,
      p.codFornPedido,
      p.codAssocPedido,
      p.codNegoPedido ,
      p.codMercPedido
      from pedido p
      join mercadoria m 
      where m.codMercadoria = p.codMercPedido 
      and p.codAssocPedido = ${codeclient}
      order by p.codNegoPedido`;


    connection.query(queryConsult, (error, results, fields) => {
      if (error) {
        console.log("Error Export Negotiation : ", error);
      } else {

        let csvData = `ID;Negociacao;Codigo ERP;Codigo de barras;Produto;Complemento;Valor;Valor (NF unitario);Valor (NF embalagem);Tipo Embalagem;Qtde. Embalagem;Qtde. Minima;Modalidade;Data inicio encarte;Data fim encarte;Termino negociacao;Marca;Estoque;Quantidade\n`;

        csvData += results[1].map((row) => {

          const internQuery = `select codNegociacao from relacionaMercadoria where codMercadoria = ${row.codMercPedido}`;

          connection.query(internQuery, (error, results, fields) => {
            if (error) {
              console.log("Error Select Negotiation to Client: ", error);
            } else {
              console.log("-----------------------------------------");
              console.log("-----------------------------------------");
              console.log(results);
              console.log("-----------------------------------------");
            }
          });


          return `${row.codMercPedido};${row.codNegoPedido};${row.erpcode};${row.barcode};${row.nomeMercadoria};${row.complemento};;;;;;;;;;;${row.marca};;${row.quantidade}`; // Substitua com os nomes das colunas do seu banco de dados


        }).join('\n');

        const dateNow = Date.now();

        // Configurar os cabeçalhos de resposta para fazer o download
        res.setHeader('Content-Disposition', `attachment; filename = ${dateNow} _negociacoes.csv`);
        res.setHeader('Content-Type', 'text/csv');

        // Transmitir o arquivo CSV como resposta
        return res.send(csvData);


        // return res.json(results[1]);
      }
    });
    // connection.end();
  },


  async getNegotiationClient(req, res) {
    logger.info("Get Negotiation to Client");

    const { codclient, codforn } = req.params;


    const queryConsult = "SET sql_mode = ''; select codNegociacao, descNegociacao, (pedido.codNegoPedido) as 'confirma' from negociacao left outer join pedido on (negociacao.codNegociacao = pedido.codNegoPedido) and pedido.codAssocPedido = " + codclient + "	where negociacao.codFornNegociacao  = " + codforn + " GROUP BY negociacao.codNegociacao ORDER BY confirma desc";


    connection.query(queryConsult, (error, results, fields) => {
      if (error) {
        console.log("Error Select Negotiation to Client: ", error);
      } else {
        return res.json(results[1]);
      }
    });
    // connection.end();
  },

  async getNegotiationClientWithPrice(req, res) {
    logger.info("Get Negotiation to Client");

    const { codclient, codforn } = req.params;


    const queryConsult = `SET sql_mode = ''; 
    select codNegociacao,
      sum(pedido.quantMercPedido * mercadoria.precoMercadoria) as 'total',
      descNegociacao, (pedido.codNegoPedido) as 'confirma'
    from negociacao 
    left outer join pedido on(negociacao.codNegociacao = pedido.codNegoPedido)
    left join mercadoria on pedido.codMercPedido = mercadoria.codMercadoria
    and pedido.codAssocPedido = ${codclient}
    where negociacao.codFornNegociacao = ${codforn}
    GROUP BY negociacao.codNegociacao 
    ORDER BY confirma desc`;


    connection.query(queryConsult, (error, results, fields) => {
      if (error) {
        console.log("Error Select Negotiation to Client: ", error);
      } else {
        return res.json(results[1]);
      }
    });
    // connection.end();
  },

  async PostInsertNegotiation(req, res) {
    logger.info("Post Save Negotiation");

    const { codNegociacao, descNegociacao, codFornNegociacao } = req.body;


    let data = {
      codNegociacao: codNegociacao,
      descNegociacao: descNegociacao,
      codFornNegociacao: codFornNegociacao,
    }


    let params = {
      table: "negociacao",
      data: data
    }
    return Insert(params)
      .then(async (resp) => {
        res.status(200).send(`message: Save Success!`);
      })
      .catch((error) => {
        res.status(400).send(error);
      });

    // connection.end();
  },

  async PostInsertNegotiationRelacionaMercadoria(req, res) {
    logger.info("Post Save Negotiation");

    const { codMercadoria, codNegociacao } = req.body;


    let data = {
      codMercadoria: codMercadoria,
      codNegociacao: codNegociacao,
    }


    let params = {
      table: "relacionaMercadoria",
      data: data
    }
    return Insert(params)
      .then(async (resp) => {
        res.status(200).send(`message: Save Success!`);
      })
      .catch((error) => {
        res.status(400).send(error);
      });

    // connection.end();
  },



};

module.exports = Negotiation;
