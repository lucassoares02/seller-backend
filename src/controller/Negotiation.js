const connection = require("@server");
const logger = require("@logger");
const Select = require("@select");
const Insert = require("@insert");

const Negotiation = {

  async getAllNegotiation(req, res) {
    logger.info("Get All Negotiations");

    const queryConsult = "select relaciona.codAssocRelaciona, consultor.nomeConsult, relaciona.codConsultRelaciona, associado.razaoAssociado,  associado.cnpjAssociado, FORMAT(COALESCE(sum(mercadoria.precoMercadoria*pedido.quantMercPedido),'0'), 2, 'de_DE') as 'valorTotal', sum(pedido.quantMercPedido) as 'volumeTotal' from associado join relaciona on relaciona.codConsultRelaciona = associado.codAssociado join consultor on consultor.codConsult = relaciona.codAssocRelaciona left join pedido on pedido.codAssocPedido = relaciona.codConsultRelaciona left join mercadoria on codMercadoria = pedido.codMercPedido group by relaciona.codConsultRelaciona order by sum(mercadoria.precoMercadoria*pedido.quantMercPedido) desc";

    connection.query(queryConsult, (error, results, fields) => {
      if (error) {
        console.log("Error Select Users: ", error);
      } else {
        return res.json(results);
      }
    });
    // connection.end();
  },



  async getNegotiationProvider(req, res) {
    logger.info("Get Negotiation Provider");

    const { codforn } = req.params;


    const queryConsult = "select negociacao.codNegociacao, negociacao.descNegociacao, negociacao.codFornNegociacao, FORMAT(IFNULL(sum(mercadoria.precoMercadoria*pedido. quantMercPedido),0), 2, 'de_DE') as 'valorTotal', IFNULL(sum(pedido.quantMercPedido),0) as 'volumeTotal' from negociacao left join pedido on pedido.codNegoPedido = negociacao.codNegociacao left join mercadoria on mercadoria.codMercadoria = pedido.codMercPedido where negociacao.codFornNegociacao = " + codforn + " group by negociacao.codNegociacao order by sum(mercadoria.precoMercadoria*pedido.quantMercPedido) desc";


    connection.query(queryConsult, (error, results, fields) => {
      if (error) {
        console.log("Error Select Negotiation Provider: ", error);
      } else {
        return res.json(results);
      }
    });
    // connection.end();
  },


  async getNegotiationClient(req, res) {
    logger.info("Get Negotiation to Client");

    const { codclient, codforn } = req.params;


    const queryConsult = "select codNegociacao, descNegociacao, (pedido.codNegoPedido) as 'confirma' from negociacao left outer join pedido on (negociacao.codNegociacao = pedido.codNegoPedido) and pedido.codAssocPedido = " + codclient + "	where negociacao.codFornNegociacao  = " + codforn + " GROUP BY negociacao.codNegociacao ORDER BY confirma desc";


    connection.query(queryConsult, (error, results, fields) => {
      if (error) {
        console.log("Error Select Negotiation to Client: ", error);
      } else {
        return res.json(results);
      }
    });
    // connection.end();
  },

  async postInsertNegotiation(req, res) {
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



};

module.exports = Negotiation;
