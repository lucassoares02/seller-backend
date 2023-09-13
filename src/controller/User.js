const connection = require("@server");
const logger = require("@logger");
const Select = require("@select");
const Insert = require("@insert");

const User = {


  async getUser(req, res) {
    logger.info("Post Request User");

    const { codacesso } = req.body;

    const queryConsult = "select codAcesso, codOrganization, direcAcesso from acesso where codAcesso = " + codacesso;

    connection.query(queryConsult, async (error, results, fields) => {
      if (error) {
        return res.status(400).send(error);
      } else {

        if (results.length > 0) {
          if (results[0].direcAcesso == 1) {

            //             set sql_mode='';
            // select 
            // acesso.codAcesso, 
            // acesso.direcAcesso,
            //  fornecedor.nomeForn, 
            // fornecedor.cnpjForn,
            //  acesso.codUsuario, 
            // fornecedor.codForn, 
            // consultor.nomeConsult,
            //  consultor.cpfConsult, 
            // FORMAT(IFNULL(sum(mercadoria.precoMercadoria*pedido.quantMercPedido), 0), 2, 'de_DE') as 'valorPedido' 
            // from acesso 

            // join consultor on acesso.codUsuario = consultor.codConsult 
            // join relacionafornecedor on consultor.codConsult = relacionafornecedor.codConsultor	
            // join fornecedor on relacionafornecedor.codFornecedor = fornecedor.codForn 
            // left join pedido on pedido.codFornPedido = fornecedor.codForn 
            // left join mercadoria on mercadoria.codMercadoria = pedido.codMercPedido 
            // where acesso.codAcesso = 1000000059091
            // group by fornecedor.codForn
            // order by valorPedido desc;



            const queryProvider = "SET sql_mode = ''; select acesso.codAcesso, acesso.direcAcesso, fornecedor.nomeForn, fornecedor.cnpjForn, acesso.codUsuario, fornecedor.codForn, consultor.nomeConsult, consultor.cpfConsult, FORMAT(IFNULL(sum(mercadoria.precoMercadoria*pedido.quantMercPedido), 0), 2, 'de_DE') as 'valorPedido' from acesso join consultor on acesso.codUsuario = consultor.codConsult join relacionafornecedor on consultor.codConsult = relacionafornecedor.codConsultor	join fornecedor on relacionafornecedor.codFornecedor = fornecedor.codForn left join pedido on pedido.codFornPedido = fornecedor.codForn left join mercadoria on mercadoria.codMercadoria = pedido.codMercPedido where acesso.codAcesso = " + codacesso;

            connection.query(queryProvider, (error, results) => {
              if (error) {
                return res.status(400).send(error);
              } else {
                return res.json(results[1]);
              }
            });
            // connection.end();

          } else if (results[0].direcAcesso == 2) {


            const queryClient = `SET sql_mode = ''; SELECT acesso.codAcesso, acesso.direcAcesso, associado.razaoAssociado AS nomeForn, associado.cnpjAssociado AS cnpjForn, acesso.codUsuario, associado.codAssociado AS codForn, consultor.nomeConsult, consultor.cpfConsult, FORMAT(IFNULL(sum(mercadoria.precoMercadoria*pedido.quantMercPedido), 0), 2, 'de_DE') as valorPedido FROM acesso join consultor on acesso.codUsuario = consultor.codConsult join relaciona on relaciona.codAssocRelaciona = consultor.codConsult join associado on associado.codAssociado = relaciona.codConsultRelaciona left join pedido on pedido.codAssocPedido = associado.codAssociado left join mercadoria on mercadoria.codMercadoria = pedido.codMercPedido WHERE acesso.codAcesso = '${codacesso}'`;

            connection.query(queryClient, (error, results) => {
              if (error) {
                return res.status(400).send(error);
              } else {

                return res.json(results[1]);
              }
            });
            // connection.end();

          } else if (results[0].direcAcesso == 3) {

            const queryOrganization = "SET sql_mode = ''; SELECT acesso.codAcesso, acesso.direcAcesso, organizador.nomeOrg AS nomeForn, organizador.cnpjOrg AS cnpjForn, acesso.codUsuario,  organizador.codOrg AS codForn, consultor.nomeConsult, consultor.cpfConsult, FORMAT(IFNULL(sum(mercadoria.precoMercadoria*pedido.quantMercPedido), 0), 2, 'de_DE') as 'valorPedido' FROM acesso join consultor on acesso.codUsuario = consultor.codConsult join organizador on organizador.codOrg = consultor.codFornConsult left join pedido on pedido.codOrganizador = organizador.codOrg left join mercadoria on mercadoria.codMercadoria = pedido.codMercPedido where codOrganizador = " + results[0].codOrganization + " and acesso.codAcesso = " + codacesso;

            connection.query(queryOrganization, (error, results) => {
              if (error) {
                return res.status(400).send(error);
              } else {
                return res.json(results[1]);
              }
            });
            // connection.end();
          }
        } else {
          res.json({ results: 0 })
        }
      };
      return 0;
    });
    // connection.end();
  },

  async getUserWeb(req, res) {
    logger.info("Post Request User");

    const { codacesso } = req.body;

    const queryConsult = "select codAcesso, codOrganization, direcAcesso from acesso where codAcesso = " + codacesso;

    connection.query(queryConsult, async (error, results, fields) => {
      if (error || results.length == 0) {
        return res.status(400).send(error);
      } else {

        if (results[0].direcAcesso == 1) {

          const queryProvider = "SET sql_mode = ''; select acesso.codAcesso, acesso.direcAcesso, fornecedor.nomeForn, fornecedor.cnpjForn, acesso.codUsuario, fornecedor.codForn, consultor.nomeConsult, consultor.cpfConsult, FORMAT(IFNULL(sum(mercadoria.precoMercadoria*pedido.quantMercPedido), 0), 2, 'de_DE') as 'valorPedido' from acesso join consultor on acesso.codUsuario = consultor.codConsult join relacionafornecedor on consultor.codConsult = relacionafornecedor.codConsultor	join fornecedor on relacionafornecedor.codFornecedor = fornecedor.codForn left join pedido on pedido.codFornPedido = fornecedor.codForn left join mercadoria on mercadoria.codMercadoria = pedido.codMercPedido where acesso.codAcesso = " + codacesso;

          connection.query(queryProvider, (error, results) => {
            if (error) {
              return ("Error Insert User Client: ", error);
            } else {
              return res.json(results[1]);
            }
          });
          // connection.end();

        } else if (results[0].direcAcesso == 2) {

          const queryClient = "SET sql_mode = ''; SELECT acesso.codAcesso, acesso.direcAcesso, associado.razaoAssociado AS nomeForn, associado.cnpjAssociado AS cnpjForn, acesso.codUsuario, associado.codAssociado AS codForn, consultor.nomeConsult, consultor.cpfConsult, FORMAT(IFNULL(sum(mercadoria.precoMercadoria*pedido.quantMercPedido), 0), 2, 'de_DE') as 'valorPedido' FROM acesso join consultor on acesso.codUsuario = consultor.codConsult join relaciona on relaciona.codAssocRelaciona = consultor.codConsult join associado on associado.codAssociado = relaciona.codConsultRelaciona left join pedido on pedido.codAssocPedido = associado.codAssociado left join mercadoria on mercadoria.codMercadoria = pedido.codMercPedido WHERE acesso.codAcesso = " + codacesso;

          connection.query(queryClient, (error, results) => {
            if (error) {
              return ("Error Update User Client: ", error);
            } else {
              return res.json(results[1]);
            }
          });
          // connection.end();

        } else if (results[0].direcAcesso == 3) {

          const queryOrganization = `SET sql_mode = '';
            SELECT 
            acesso.codAcesso, 
            acesso.direcAcesso, 
            organizador.nomeOrg AS nomeForn, 
            organizador.cnpjOrg AS cnpjForn, 
            acesso.codUsuario,  organizador.codOrg AS codForn, 
            consultor.nomeConsult, 
            consultor.cpfConsult
            FROM acesso 
            join consultor on acesso.codUsuario = consultor.codConsult 
            join organizador on organizador.codOrg = consultor.codFornConsult 
            where organizador.codOrg = ${results[0].codOrganization} 
            and acesso.codAcesso = ${codacesso}`;

          connection.query(queryOrganization, (error, results) => {
            if (error) {
              return ("Error Update User Client: ", error);
            } else {
              return res.json(results[1]);
            }
          });
          // connection.end();
        }
      };
      return 0;
    });
    // connection.end();
  },


  async getAllUsersAccess(req, res) {
    logger.info("Get All Users Fair");

    const queryConsult = `SET sql_mode = ''; 
    SELECT acesso.codAcesso, 
    acesso.direcAcesso, organizador.nomeOrg AS nomeForn, 
    organizador.cnpjOrg AS cnpjForn, acesso.codUsuario,  
    organizador.codOrg AS codForn, consultor.nomeConsult, 
    consultor.cpfConsult, 
    FORMAT(IFNULL(sum(mercadoria.precoMercadoria*pedido.quantMercPedido), 0), 2, 'de_DE') as 'valorPedido' 
    FROM acesso 
    join consultor on acesso.codUsuario = consultor.codConsult 
    join organizador on organizador.codOrg = consultor.codFornConsult
     left join pedido on pedido.codOrganizador = organizador.codOrg 
     left join mercadoria on mercadoria.codMercadoria = pedido.codMercPedido where codOrganizador = 158 
     group by consultor.codConsult`;

    connection.query(queryConsult, (error, results, fields) => {
      if (error) {
        return res.status(400).send(error);
      } else {
        return res.json(results[1]);
      }
    });
    // connection.end();
  },




};

module.exports = User;


