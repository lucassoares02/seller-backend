const connection = require("@server");
const logger = require("@logger");
const Select = require("@select");
const Insert = require("@insert");
const Execute = require("../libs/execute");

const Client = {

  async getAllClient(req, res) {
    logger.info("Get All Clients");

    const params = req.body;
    console.log(params);

    const queryConsult = "SET sql_mode = ''; select relaciona.codAssocRelaciona, consultor.nomeConsult, relaciona.codConsultRelaciona, associado.razaoAssociado,  associado.cnpjAssociado, FORMAT(ifnull(sum(mercadoria.precoMercadoria*pedido.quantMercPedido), 0 ), 2, 'de_DE') as 'valorTotal', ifnull(sum(pedido.quantMercPedido), 0) as 'volumeTotal' from associado join relaciona on relaciona.codConsultRelaciona = associado.codAssociado join consultor on consultor.codConsult = relaciona.codAssocRelaciona left join pedido on pedido.codAssocPedido = relaciona.codConsultRelaciona left join mercadoria on codMercadoria = pedido.codMercPedido group by relaciona.codConsultRelaciona order by sum(mercadoria.precoMercadoria*pedido.quantMercPedido) desc";


    connection.query(queryConsult, (error, results, fields) => {
      if (error) {
        console.log("Error Select Users: ", error);
      } else {
        return res.json(results[1]);
      }
    });
    // connection.end();
  },


  async getOneClient(req, res) {
    logger.info("Get One Clients");

    const { codacesso } = req.params;

    const queryConsult = "SET sql_mode = '';acesso.codAcesso, acesso.direcAcesso, associado.razaoAssociado AS nomeForn, associado.cnpjAssociado AS cnpjForn, acesso.codUsuario, associado.codAssociado AS codForn, consultor.nomeConsult, consultor.cpfConsult FROM acesso JOIN consultor ON acesso.codUsuario = consultor.codConsult JOIN associado ON consultor.codFornConsult = associado.codAssociado WHERE acesso.codAcesso =" + codacesso;

    connection.query(queryConsult, (error, results, fields) => {
      if (error) {
        console.log("Error Select Client: ", error);
      } else {
        return res.json(results[1]);
      }
    });
    // connection.end();
  },


  async getClientConsult(req, res) {
    logger.info("Get Clients to Consult");

    const { codconsultor } = req.params;

    const queryConsult = "SET sql_mode = ''; select codAssociado, cnpjAssociado, razaoAssociado, codAssociado, FORMAT(ifnull(sum(mercadoria.precoMercadoria*pedido.quantMercPedido),0), 2, 'de_DE') as 'valorTotal', ifnull(sum(pedido.quantMercPedido), 0) as 'volumeTotal' from associado left join pedido on pedido.codAssocPedido = associado.codAssociado left join relacionafornecedor on relacionafornecedor.codFornecedor = pedido.codFornPedido left join mercadoria on mercadoria.codMercadoria = pedido.codMercPedido and relacionafornecedor.codConsultor =" + codconsultor + " group by associado.codAssociado order by sum(mercadoria.precoMercadoria*pedido.quantMercPedido) desc";

    connection.query(queryConsult, (error, results, fields) => {
      if (error) {
        console.log("Error Select Clients to Consult: ", error);
      } else {
        return res.json(results[1]);
      }
    });
    // connection.end();
  },


  async getStoreConsultant(req, res) {
    logger.info("Get Store to Consult");

    const { codconsultor } = req.params;

    const queryConsult = `
    select
relaciona.codAssocRelaciona as codAssociado,
consultor.nomeConsult, 
relaciona.codConsultRelaciona,
associado.razaoAssociado,
associado.cnpjAssociado, 
IFNULL(sum(mercadoria.precoMercadoria*pedido.quantMercPedido),0) as 'valor',
IFNULL(sum(pedido.quantMercPedido), 0) as 'volume'
from consultor
inner join relaciona on consultor.codConsult = relaciona.codAssocRelaciona
inner join associado on associado.codAssociado = relaciona.codConsultRelaciona 
left join pedido on pedido.codAssocPedido = relaciona.codConsultRelaciona 
left join mercadoria on mercadoria.codMercadoria = pedido.codMercPedido 
where relaciona.codAssocRelaciona = ${codconsultor}
group by relaciona.codConsultRelaciona 
order by valor 
desc`;

    connection.query(queryConsult, (error, results, fields) => {
      if (error) {
        console.log("Error Select Store to Consult: ", error);
      } else {
        return res.json(results[1]);
      }
    });
    // connection.end();
  },



  async getClientMerchandise(req, res) {
    logger.info("Get Clients to Merchandise");

    const { codmercadoria, codnegotiation } = req.params;

    const queryConsult = `
    select 
    mercadoria.codMercadoria, 
    mercadoria.codFornMerc,
    mercadoria.nomeMercadoria,
    mercadoria.embMercadoria,
    associado.razaoAssociado as razao,
    associado.codAssociado,
    mercadoria.precoMercadoria as precoMercadoria, 
    IFNULL(SUM(pedido.quantMercPedido), 0) as fatorMerc,
    IFNULL(sum(mercadoria.precoMercadoria*pedido.quantMercPedido),0) as 'valorTotal'
    from mercadoria 
    left outer join pedido on mercadoria.codMercadoria = pedido.codMercPedido 
    left join associado on associado.codAssociado = pedido.codAssocPedido
    where mercadoria.codMercadoria = ${codmercadoria} 
    group by pedido.codAssocPedido
    order by sum(mercadoria.precoMercadoria*pedido.quantMercPedido) 
    desc`;

    connection.query(queryConsult, (error, results, fields) => {
      if (error) {
        console.log("Error Select Clients to Merchandise: ", error);
      } else {
        return res.json(results[1]);
      }
    });
    // connection.end();
  },


  async getClientMerchandiseTrading(req, res) {
    logger.info("Get Clients to Merchandise");

    const { codmercadoria, codnegotiation } = req.params;

    const queryConsult = `
    select 
    mercadoria.codMercadoria, 
    mercadoria.codFornMerc,
    mercadoria.nomeMercadoria,
    mercadoria.embMercadoria,
    associado.razaoAssociado as razao,
    associado.codAssociado,
    mercadoria.precoMercadoria as precoMercadoria, 
    IFNULL(SUM(pedido.quantMercPedido), 0) as fatorMerc,
    IFNULL(sum(mercadoria.precoMercadoria*pedido.quantMercPedido),0) as 'valorTotal'
    from mercadoria 
    left outer join pedido on mercadoria.codMercadoria = pedido.codMercPedido 
    left join associado on associado.codAssociado = pedido.codAssocPedido
    where mercadoria.codMercadoria = ${codmercadoria} 
    and pedido.codNegoPedido = ${codnegotiation}
    group by pedido.codAssocPedido
    order by sum(mercadoria.precoMercadoria*pedido.quantMercPedido) 
    desc`;

    connection.query(queryConsult, (error, results, fields) => {
      if (error) {
        console.log("Error Select Clients to Merchandise: ", error);
      } else {
        return res.json(results[1]);
      }
    });
    // connection.end();
  },

  async getStoresCategory(req, res) {
    logger.info("Get Clients to Category");

    const { codprovider } = req.params;

    const queryConsult = "SET sql_mode = ''; select relaciona.codAssocRelaciona, consultor.nomeConsult, relaciona.codConsultRelaciona, associado.razaoAssociado, associado.cnpjAssociado, FORMAT( IFNULL(sum(mercadoria.precoMercadoria*pedido.quantMercPedido), 0), 2, 'de_DE') as 'valorTotal',  IFNULL(sum(pedido.quantMercPedido), 0) as 'volumeTotal' from associado join relaciona on relaciona.codConsultRelaciona = associado.codAssociado join consultor on consultor.codConsult = relaciona.codAssocRelaciona left join pedido on pedido.codAssocPedido = relaciona.codConsultRelaciona join fornecedor on fornecedor.codForn = pedido.codFornPedido left join mercadoria on codMercadoria = pedido.codMercPedido where fornecedor.codForn = " + codprovider + " group by relaciona.codConsultRelaciona order by sum(mercadoria.precoMercadoria*pedido.quantMercPedido) desc";

    connection.query(queryConsult, (error, results, fields) => {
      if (error) {
        console.log("Error Select Clients to Category: ", error);
      } else {
        return res.json(results[1]);
      }
    });
    // connection.end();
  },

  async getAllStores(req, res) {
    logger.info("Get All Stores");

    const queryConsult = `
    select 
    relaciona.codAssocRelaciona,
    consultor.nomeConsult, 
    relaciona.codConsultRelaciona,
    associado.razaoAssociado as razao,
    associado.cnpjAssociado, 
    IFNULL(sum(mercadoria.precoMercadoria*pedido.quantMercPedido), 0) as 'valorTotal',
    IFNULL(sum(pedido.quantMercPedido), 0) as 'volumeTotal' 
    from associado 
    join relaciona on relaciona.codConsultRelaciona = associado.codAssociado
    join consultor on consultor.codConsult = relaciona.codAssocRelaciona 
    left join pedido on pedido.codAssocPedido = relaciona.codConsultRelaciona
    left join mercadoria on codMercadoria = pedido.codMercPedido 
    group by relaciona.codConsultRelaciona 
    order by sum(mercadoria.precoMercadoria*pedido.quantMercPedido) 
    desc`;

    connection.query(queryConsult, (error, results, fields) => {
      if (error) {
        console.log("Error Select All Stores: ", error);
      } else {
        return res.json(results[1]);
      }
    });
    // connection.end();
  },


  async getStoresbyProvider(req, res) {
    logger.info("Get Stores by Provider");


    const { codprovider } = req.params;

    const queryConsult = `SET sql_mode = ''; select  
    p.codPedido ,
    a.codAssociado ,
    a.razaoAssociado  as razao,
    a.cnpjAssociado ,
    sum(IFNULL(p.quantMercPedido * m.precoMercadoria, 0)) as 'valorTotal',
    sum(IFNULL(p.quantMercPedido, 0)) as 'volumeTotal'
    from associado a
    left join pedido p on p.codAssocPedido = a.codAssociado 
    left join mercadoria m  on m.codMercadoria = p.codMercPedido
    and p.codFornPedido = ${codprovider}
    group by a.codAssociado 
    order by valorTotal
    desc`;

    connection.query(queryConsult, (error, results, fields) => {
      if (error) {
        console.log("Error Select Stores by Provider: ", error);
      } else {
        return res.json(results[1]);
      }
    });
    // connection.end();
  },


  async postUser(req, res) {
    logger.info("Insert User");

    const params = req.body;

    Insert(params)
      .then(async (resp) => {

        return await Select({ table: 'user', where: { id: resp.insertId } })
          .then((resp) => {
            return res.json(resp[0]);
          })
          .catch((error) => {
            return res.json(error);
          });
      })
      .catch((error) => {
        return res.json(error);
      });
  },

  async postInsertPerson(req, res) {
    logger.info("Post Insert Person");

    const { cod, nome, email, empresa, tel, cpf, type, hash } = req.body;

    console.log(cod);

    const queryInsert = `INSERT INTO 
    consultor 
        (codConsult, nomeConsult,	cpfConsult,	telConsult,	codFornConsult,	emailConsult) 
    VALUES ("${cod}","${nome}", "${cpf}", "${tel}", "${empresa}", "${email}")`;

    //=============================================================
    //=============================================================
    //=============================================================

    let result = true;
    let response = "";


    connection.query(queryInsert, (error, results) => {
      if (error) {
        result = false;
        return res.json({ "message": error.sqlMessage });
      } else {
        response = results;
        return;
      }
    });


    //=============================================================
    //=============================================================
    //=============================================================

    if (result) {
      const queryAccess = `insert into acesso (codAcesso, direcAcesso, codUsuario, codOrganization) values("${hash}", "${type}", "${cod}", 158)`;

      connection.query(queryAccess, (error, results) => {
        if (error) {
          result = false;
          return;
        } else {
          return;
        }
      });

    }

    //=============================================================
    //=============================================================
    //=============================================================

    if (result) {
      let dataAssociado = {
        codAssocRelaciona: cod,
        codConsultRelaciona: empresa
      }

      let dataConsultor = {
        codConsultor: cod,
        codFornecedor: empresa,
      }

      let params = {
        table: type == 1 ? "relacionafornecedor" : "relaciona",
        data: type == 1 ? dataConsultor : dataAssociado
      }

      console.log(params);

      Insert(params)
        .then(async (resp) => {
          console.log(resp);
          res.status(200).send(`message: Save Success!`);
        })
        .catch((error) => {
          console.log(error);
          return res.status(400).send(error);
        });


    }
  },


  async getAllStoresGraph(req, res) {
    logger.info("Get All Stores Graphs");

    const queryConsult = `
    select 
    relaciona.codAssocRelaciona,
    consultor.nomeConsult, 
    relaciona.codConsultRelaciona,
    associado.razaoAssociado as razao,
    associado.cnpjAssociado, 
    IFNULL(sum(mercadoria.precoMercadoria*pedido.quantMercPedido), 0) as 'valorTotal',
    IFNULL(sum(pedido.quantMercPedido), 0) as 'volumeTotal' 
    from associado 
    join relaciona on relaciona.codConsultRelaciona = associado.codAssociado
    join consultor on consultor.codConsult = relaciona.codAssocRelaciona 
    left join pedido on pedido.codAssocPedido = relaciona.codConsultRelaciona
    left join mercadoria on codMercadoria = pedido.codMercPedido 
    group by relaciona.codConsultRelaciona 
    order by sum(mercadoria.precoMercadoria*pedido.quantMercPedido) 
    desc`;

    connection.query(queryConsult, (error, results, fields) => {
      if (error) {
        console.log("Error Select All Stores Graphs: ", error);
      } else {
        let item = [];

        let total = 0;

        for (let j = 0; j < results.length; j++) {
          total += results[j]["valorTotal"];
        }


        i = 0;
        for (i = 0; i < results.length; i++) {
          item.push({
            razao: results[i]["razao"],
            percentage: Math.floor((results[i]["valorTotal"] / total) * 100) + "%",
            value: results[i]["valorTotal"]
          });
        }

        response = {
          item: item,
          total: total
        }

        return res.json(response);
      }
    });
    // connection.end();
  },

  async getAllStoresGraphHour(req, res) {
    logger.info("Get All Stores Graphs");

    const queryConsult = `SET sql_mode = ''; select 
    date_format(dataPedido, '%Y-%m-%d %H:%i')  as hour,
    SUM(p.quantMercPedido * m.precoMercadoria) as value
    from pedido p
    join mercadoria m on m.codMercadoria = p.codMercPedido 
    group by hour
    order by hour`;

    connection.query(queryConsult, (error, results, fields) => {
      if (error) {
        console.log("Error Select All Stores Graphs: ", error);
      } else {

        return res.json(results[1]);
      }
    });
    // connection.end();
  },



  async getValueTotalFair(req, res) {
    logger.info("Get All Value Fair");

    const queryConsult = `SET sql_mode = ''; select 
    SUM(p.quantMercPedido * m.precoMercadoria) as value
    from pedido p
    join mercadoria m on m.codMercadoria = p.codMercPedido 
    order by value`;

    connection.query(queryConsult, (error, results, fields) => {
      if (error) {
        console.log("Error Select All Value Fair: ", error);
      } else {

        return res.json(results[1]);
      }
    });
    // connection.end();
  },




};

module.exports = Client;


