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

    const queryConsult = "select relaciona.codAssocRelaciona, consultor.nomeConsult, relaciona.codConsultRelaciona, associado.razaoAssociado,  associado.cnpjAssociado, FORMAT(ifnull(sum(mercadoria.precoMercadoria*pedido.quantMercPedido), 0 ), 2, 'de_DE') as 'valorTotal', ifnull(sum(pedido.quantMercPedido), 0) as 'volumeTotal' from associado join relaciona on relaciona.codConsultRelaciona = associado.codAssociado join consultor on consultor.codConsult = relaciona.codAssocRelaciona left join pedido on pedido.codAssocPedido = relaciona.codConsultRelaciona left join mercadoria on codMercadoria = pedido.codMercPedido group by relaciona.codConsultRelaciona order by sum(mercadoria.precoMercadoria*pedido.quantMercPedido) desc";

    connection.query(queryConsult, (error, results, fields) => {
      if (error) {
        console.log("Error Select Users: ", error);
      } else {
        return res.json(results);
      }
    });
    // connection.end();
  },


  async getOneClient(req, res) {
    logger.info("Get One Clients");

    const { codacesso } = req.params;

    const queryConsult = "SELECT acesso.codAcesso, acesso.direcAcesso, associado.razaoAssociado AS nomeForn, associado.cnpjAssociado AS cnpjForn, acesso.codUsuario, associado.codAssociado AS codForn, consultor.nomeConsult, consultor.cpfConsult FROM acesso JOIN consultor ON acesso.codUsuario = consultor.codConsult JOIN associado ON consultor.codFornConsult = associado.codAssociado WHERE acesso.codAcesso =" + codacesso;

    connection.query(queryConsult, (error, results, fields) => {
      if (error) {
        console.log("Error Select Client: ", error);
      } else {
        return res.json(results);
      }
    });
    // connection.end();
  },


  async getClientConsult(req, res) {
    logger.info("Get Clients to Consult");

    const { codconsultor } = req.params;

    const queryConsult = "select codAssociado, cnpjAssociado, razaoAssociado, codAssociado, FORMAT(ifnull(sum(mercadoria.precoMercadoria*pedido.quantMercPedido),0), 2, 'de_DE') as 'valorTotal', ifnull(sum(pedido.quantMercPedido), 0) as 'volumeTotal' from associado left join pedido on pedido.codAssocPedido = associado.codAssociado left join relacionaFornecedor on relacionaFornecedor.codFornecedor = pedido.codFornPedido left join mercadoria on mercadoria.codMercadoria = pedido.codMercPedido and relacionaFornecedor.codConsultor =" + codconsultor + " group by associado.codAssociado order by sum(mercadoria.precoMercadoria*pedido.quantMercPedido) desc";

    connection.query(queryConsult, (error, results, fields) => {
      if (error) {
        console.log("Error Select Clients to Consult: ", error);
      } else {
        return res.json(results);
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
        return res.json(results);
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
        return res.json(results);
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
        return res.json(results);
      }
    });
    // connection.end();
  },

  async getStoresCategory(req, res) {
    logger.info("Get Clients to Category");

    const { codprovider } = req.params;

    const queryConsult = "select relaciona.codAssocRelaciona, consultor.nomeConsult, relaciona.codConsultRelaciona, associado.razaoAssociado, associado.cnpjAssociado, FORMAT( IFNULL(sum(mercadoria.precoMercadoria*pedido.quantMercPedido), 0), 2, 'de_DE') as 'valorTotal',  IFNULL(sum(pedido.quantMercPedido), 0) as 'volumeTotal' from associado join relaciona on relaciona.codConsultRelaciona = associado.codAssociado join consultor on consultor.codConsult = relaciona.codAssocRelaciona left join pedido on pedido.codAssocPedido = relaciona.codConsultRelaciona join fornecedor on fornecedor.codForn = pedido.codFornPedido left join mercadoria on codMercadoria = pedido.codMercPedido where fornecedor.codForn = " + codprovider + " group by relaciona.codConsultRelaciona order by sum(mercadoria.precoMercadoria*pedido.quantMercPedido) desc";

    connection.query(queryConsult, (error, results, fields) => {
      if (error) {
        console.log("Error Select Clients to Category: ", error);
      } else {
        return res.json(results);
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
        return res.json(results);
      }
    });
    // connection.end();
  },



  async getStoresbyProvider(req, res) {
    logger.info("Get Stores by Provider");


    const { codprovider } = req.params;

    const queryConsult = `select  
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
        return res.json(results);
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

    const { cod, nome, email, empresa, tel, type } = req.body;

    console.log(cod);

    let queryInsert = "";

    if (type == 1) {
      queryInsert = `INSERT INTO 
      consultor 
          (nomeConsult,	cpfConsult,	telConsult,	codFornConsult,	emailConsult) 
      VALUES ("${nome}", "123123123", "${tel}", "${empresa}", "${email}")`;
    } else {
      queryInsert = `INSERT INTO 
      cliente 
          (nomeCliente,	codAssocCliente,	cpfCliente,	telCliente,	emailCliente) 
      VALUES ("${nome}", "${empresa}", "123123123", "${tel}", "${email}")`;
    }

    //=============================================================
    //=============================================================
    //=============================================================

    let result = true;
    connection.query(queryInsert, (error, results) => {
      if (error) {
        result = false;
        return res.json({ "messaege": error.sqlMessage });
      } else {
        return;
      }
    });

    //=============================================================
    //=============================================================
    //=============================================================

    if (result) {

      const queryAccess = `insert into acesso (codAcesso, direcAcesso, codUsuario, codOrganization) values("${cod}", "${type}", "${cod}", 158)`;
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

      // let querySave = ``;
      // if (type == 1) {
      //   querySave = `insert into relaciona (codAssocRelaciona, codConsultRelaciona) values(${cod},${empresa})`;
      // } else {
      //   querySave = `insert into relacionafornecedor (codConsultor, codFornecedor) values(${cod}, ${empresa})`;
      // }

      // console.log("====== Query Save =======");
      // console.log(querySave);

      // return connection.query(querySave, (error, results) => {
      //   console.log("======== Results =========")
      //   console.log(results);
      //   if (error != null) {
      //     console.log(error);
      //     return;
      //   } else {
      //     return;
      //   }
      // });



      let dataAssociado = {
        codAssocRelaciona: cod,
        codConsultRelaciona: empresa
      }

      let dataConsultor = {
        codConsultor: cod,
        codFornecedor: empresa,
      }

      let params = {
        table: type == 1 ? "relacionaFornecedor" : "relaciona",
        data: type == 1 ? dataConsultor : dataAssociado
      }

      console.log(params);

      Insert(params)
        .then(async (resp) => {
          console.log(resp);
        })
        .catch((error) => {
          console.log(error);
          return res.json(error);
        });

      res.json({ message: "success" });

    }
  }
};

module.exports = Client;


