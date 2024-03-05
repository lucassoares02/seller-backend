const connection = require("@server");
const logger = require("@logger");
const Select = require("@select");
const Insert = require("@insert");

const User = {
  async getUserDoubleCompany(req, res) {
    logger.info("Post Request User");

    const { codacesso } = req.body;

    const queryConsult = "select codAcesso, codOrganization, direcAcesso from acesso where codAcesso = " + codacesso;

    connection.query(queryConsult, async (error, results, fields) => {
      if (error) {
        return res.status(400).send(error);
      } else {
        if (results.length > 0) {
          if (results[0].direcAcesso == 1) {
            const queryProvider = `
            set sql_mode = '';
            select
            acesso.codAcesso,
              acesso.direcAcesso,
              fornecedor.nomeForn,
              fornecedor.cnpjForn,
              acesso.codUsuario,
              fornecedor.codForn,
              consultor.nomeConsult,
              consultor.cpfConsult,
              FORMAT(IFNULL(sum(mercadoria.precoMercadoria * pedido.quantMercPedido), 0), 2, 'de_DE') as 'valorPedido' 
            from acesso 
            join consultor on acesso.codUsuario = consultor.codConsult 
            join relacionafornecedor on consultor.codConsult = relacionafornecedor.codConsultor	
            join fornecedor on relacionafornecedor.codFornecedor = fornecedor.codForn 
            left join pedido on pedido.codFornPedido = fornecedor.codForn 
            left join mercadoria on mercadoria.codMercadoria = pedido.codMercPedido 
            where acesso.codAcesso = ${codacesso}
            group by fornecedor.codForn
            order by valorPedido desc;
            `;

            connection.query(queryProvider, (error, results) => {
              if (error) {
                return res.status(400).send(error);
              } else {
                return res.json(results[1]);
              }
            });
            // connection.end();
          } else if (results[0].direcAcesso == 2) {
            const queryClient = `
              SET sql_mode = ''; 
              SELECT acesso.codAcesso,
              acesso.direcAcesso,
              associado.razaoAssociado AS nomeForn,
              associado.cnpjAssociado AS cnpjForn,
              acesso.codUsuario, 
              associado.codAssociado AS codForn,
              consultor.nomeConsult, consultor.cpfConsult, 
              FORMAT(IFNULL(sum(mercadoria.precoMercadoria*pedido.quantMercPedido), 0), 2, 'de_DE') as valorPedido 
              FROM acesso
              join consultor on acesso.codUsuario = consultor.codConsult 
              join relaciona on relaciona.codAssocRelaciona = consultor.codConsult
              join associado on associado.codAssociado = relaciona.codConsultRelaciona
              left join pedido on pedido.codAssocPedido = associado.codAssociado 
              left join mercadoria on mercadoria.codMercadoria = pedido.codMercPedido
              WHERE acesso.codAcesso = '${codacesso}'
              group by associado.codAssociado
              order by valorPedido desc;
            `;

            // `SET sql_mode = ''; SELECT acesso.codAcesso, acesso.direcAcesso, associado.razaoAssociado AS nomeForn, associado.cnpjAssociado AS cnpjForn, acesso.codUsuario, associado.codAssociado AS codForn, consultor.nomeConsult, consultor.cpfConsult, FORMAT(IFNULL(sum(mercadoria.precoMercadoria*pedido.quantMercPedido), 0), 2, 'de_DE') as valorPedido FROM acesso join consultor on acesso.codUsuario = consultor.codConsult join relaciona on relaciona.codAssocRelaciona = consultor.codConsult join associado on associado.codAssociado = relaciona.codConsultRelaciona left join pedido on pedido.codAssocPedido = associado.codAssociado left join mercadoria on mercadoria.codMercadoria = pedido.codMercPedido WHERE acesso.codAcesso = '${codacesso}'`;

            connection.query(queryClient, (error, results) => {
              if (error) {
                return res.status(400).send(error);
              } else {
                return res.json(results[1]);
              }
            });
            // connection.end();
          } else if (results[0].direcAcesso == 3) {
            // const queryOrganization = "SET sql_mode = ''; SELECT acesso.codAcesso, acesso.direcAcesso, organizador.nomeOrg AS nomeForn, organizador.cnpjOrg AS cnpjForn, acesso.codUsuario,  organizador.codOrg AS codForn, consultor.nomeConsult, consultor.cpfConsult, consultor.emailConsult, FORMAT(IFNULL(sum(mercadoria.precoMercadoria*pedido.quantMercPedido), 0), 2, 'de_DE') as 'valorPedido' FROM acesso join consultor on acesso.codUsuario = consultor.codConsult join organizador on organizador.codOrg = consultor.codFornConsult left join pedido on pedido.codOrganizador = organizador.codOrg left join mercadoria on mercadoria.codMercadoria = pedido.codMercPedido where codOrganizador = " + results[0].codOrganization + " and acesso.codAcesso = " + codacesso;
            // const queryOrganization = "SET sql_mode = ''; SELECT acesso.codAcesso, acesso.direcAcesso, organizador.nomeOrg AS nomeForn, organizador.cnpjOrg AS cnpjForn, acesso.codUsuario,  organizador.codOrg AS codForn, consultor.nomeConsult, consultor.cpfConsult, FORMAT(IFNULL(sum(mercadoria.precoMercadoria*pedido.quantMercPedido), 0), 2, 'de_DE') as 'valorPedido' FROM acesso join consultor on acesso.codUsuario = consultor.codConsult join organizador on organizador.codOrg = consultor.codFornConsult left join pedido on pedido.codOrganizador = organizador.codOrg left join mercadoria on mercadoria.codMercadoria = pedido.codMercPedido and acesso.codAcesso = " + codacesso;
            const queryOrganization = `
            SET sql_mode = '';
            SELECT 
            acesso.codAcesso, 
            acesso.direcAcesso, 
            organizador.nomeOrg AS nomeForn, 
            organizador.cnpjOrg AS cnpjForn, 
            acesso.codUsuario,  organizador.codOrg AS codForn, 
            consultor.nomeConsult, 
            consultor.cpfConsult,
            FORMAT(IFNULL(sum(mercadoria.precoMercadoria*pedido.quantMercPedido), 0), 2, 'de_DE') as valorPedido 
            FROM acesso 
            join consultor on acesso.codUsuario = consultor.codConsult 
            join organizador on organizador.codOrg = consultor.codFornConsult 
            left join pedido on pedido.codOrganizador = organizador.codOrg 
            left join mercadoria on mercadoria.codMercadoria = pedido.codMercPedido
            where organizador.codOrg = ${results[0].codOrganization} 
            and acesso.codAcesso = ${codacesso}`;

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
          res.json({ results: 0 });
        }
      }
      return 0;
    });
    // connection.end();
  },

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

            const queryProvider = `
            SET sql_mode = ''; select 
            acesso.codAcesso, 
            acesso.direcAcesso,
            fornecedor.nomeForn,
            fornecedor.cnpjForn,
            acesso.codUsuario,
            fornecedor.codForn, 
            consultor.nomeConsult,
            consultor.emailConsult,
            consultor.cpfConsult, 
            FORMAT(IFNULL(sum(mercadoria.precoMercadoria*pedido.quantMercPedido), 0), 2, 'de_DE') as 'valorPedido' 
            from acesso join consultor on acesso.codUsuario = consultor.codConsult
            join relacionafornecedor on consultor.codConsult = relacionafornecedor.codConsultor
              join fornecedor on relacionafornecedor.codFornecedor = fornecedor.codForn 
            left join pedido on pedido.codFornPedido = fornecedor.codForn
            left join mercadoria on mercadoria.codMercadoria = pedido.codMercPedido 
            where acesso.codAcesso = ${codacesso}
            `;

            connection.query(queryProvider, (error, results) => {
              if (error) {
                return res.status(400).send(error);
              } else {
                return res.json(results[1]);
              }
            });
            // connection.end();
          } else if (results[0].direcAcesso == 2) {
            const queryClient = `SET sql_mode = ''; SELECT acesso.codAcesso, acesso.direcAcesso, associado.razaoAssociado AS nomeForn, associado.cnpjAssociado AS cnpjForn, acesso.codUsuario, associado.codAssociado AS codForn, consultor.nomeConsult, consultor.emailConsult, consultor.cpfConsult, FORMAT(IFNULL(sum(mercadoria.precoMercadoria*pedido.quantMercPedido), 0), 2, 'de_DE') as valorPedido FROM acesso join consultor on acesso.codUsuario = consultor.codConsult join relaciona on relaciona.codAssocRelaciona = consultor.codConsult join associado on associado.codAssociado = relaciona.codConsultRelaciona left join pedido on pedido.codAssocPedido = associado.codAssociado left join mercadoria on mercadoria.codMercadoria = pedido.codMercPedido WHERE acesso.codAcesso = '${codacesso}'`;

            connection.query(queryClient, (error, results) => {
              if (error) {
                return res.status(400).send(error);
              } else {
                return res.json(results[1]);
              }
            });
            // connection.end();
          } else if (results[0].direcAcesso == 3) {
            // const queryOrganization = "SET sql_mode = ''; SELECT acesso.codAcesso, acesso.direcAcesso, organizador.nomeOrg AS nomeForn, organizador.cnpjOrg AS cnpjForn, acesso.codUsuario,  organizador.codOrg AS codForn, consultor.nomeConsult,consultor.emailConsult, consultor.cpfConsult, FORMAT(IFNULL(sum(mercadoria.precoMercadoria*pedido.quantMercPedido), 0), 2, 'de_DE') as 'valorPedido' FROM acesso join consultor on acesso.codUsuario = consultor.codConsult join organizador on organizador.codOrg = consultor.codFornConsult left join pedido on pedido.codOrganizador = organizador.codOrg left join mercadoria on mercadoria.codMercadoria = pedido.codMercPedido where codOrganizador = " + results[0].codOrganization + " and acesso.codAcesso = " + codacesso;
            const queryOrganization =
              "SET sql_mode = ''; SELECT acesso.codAcesso, acesso.direcAcesso, organizador.nomeOrg AS nomeForn, organizador.cnpjOrg AS cnpjForn, acesso.codUsuario,  organizador.codOrg AS codForn, consultor.nomeConsult, consultor.cpfConsult, consultor.emailConsult, FORMAT(IFNULL(sum(mercadoria.precoMercadoria*pedido.quantMercPedido), 0), 2, 'de_DE') as 'valorPedido' FROM acesso join consultor on acesso.codUsuario = consultor.codConsult join organizador on organizador.codOrg = consultor.codFornConsult left join pedido on pedido.codOrganizador = organizador.codOrg left join mercadoria on mercadoria.codMercadoria = pedido.codMercPedido and acesso.codAcesso = " +
              codacesso;

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
          res.json({ results: 0 });
        }
      }
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
          const queryProvider =
            "SET sql_mode = ''; select acesso.codAcesso, acesso.direcAcesso, fornecedor.nomeForn, fornecedor.cnpjForn, acesso.codUsuario, fornecedor.codForn, consultor.nomeConsult, consultor.cpfConsult, FORMAT(IFNULL(sum(mercadoria.precoMercadoria*pedido.quantMercPedido), 0), 2, 'de_DE') as 'valorPedido' from acesso join consultor on acesso.codUsuario = consultor.codConsult join relacionafornecedor on consultor.codConsult = relacionafornecedor.codConsultor	join fornecedor on relacionafornecedor.codFornecedor = fornecedor.codForn left join pedido on pedido.codFornPedido = fornecedor.codForn left join mercadoria on mercadoria.codMercadoria = pedido.codMercPedido where acesso.codAcesso = " +
            codacesso;

          connection.query(queryProvider, (error, results) => {
            if (error) {
              return "Error Insert User Client: ", error;
            } else {
              return res.json(results[1]);
            }
          });
          // connection.end();
        } else if (results[0].direcAcesso == 2) {
          const queryClient =
            "SET sql_mode = ''; SELECT acesso.codAcesso, acesso.direcAcesso, associado.razaoAssociado AS nomeForn, associado.cnpjAssociado AS cnpjForn, acesso.codUsuario, associado.codAssociado AS codForn, consultor.nomeConsult, consultor.cpfConsult, FORMAT(IFNULL(sum(mercadoria.precoMercadoria*pedido.quantMercPedido), 0), 2, 'de_DE') as 'valorPedido' FROM acesso join consultor on acesso.codUsuario = consultor.codConsult join relaciona on relaciona.codAssocRelaciona = consultor.codConsult join associado on associado.codAssociado = relaciona.codConsultRelaciona left join pedido on pedido.codAssocPedido = associado.codAssociado left join mercadoria on mercadoria.codMercadoria = pedido.codMercPedido WHERE acesso.codAcesso = " +
            codacesso;

          connection.query(queryClient, (error, results) => {
            if (error) {
              return "Error Update User Client: ", error;
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
              return "Error Update User Client: ", error;
            } else {
              return res.json(results[1]);
            }
          });
          // connection.end();
        }
      }
      return 0;
    });
    // connection.end();
  },

  async getAllUsersOrg(req, res) {
    logger.info("Get All Users Fair");

    const queryConsult = `SET sql_mode = ''; 
    SELECT acesso.codAcesso, 
    acesso.direcAcesso, organizador.nomeOrg AS nomeForn, 
    organizador.cnpjOrg AS cnpjForn, acesso.codUsuario,  
    organizador.codOrg AS codForn, consultor.nomeConsult, 
    consultor.cpfConsult 
    FROM acesso 
    join consultor on acesso.codUsuario = consultor.codConsult 
    join organizador on organizador.codOrg = consultor.codFornConsult
    where organizador.codOrg = 158 
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

  async getAllUsersProvider(req, res) {
    logger.info("Get All Users Fair");

    const queryConsult = `SET sql_mode = ''; select acesso.codAcesso, acesso.direcAcesso, fornecedor.nomeForn, fornecedor.cnpjForn, acesso.codUsuario, fornecedor.codForn, consultor.nomeConsult, consultor.cpfConsult, FORMAT(IFNULL(sum(mercadoria.precoMercadoria*pedido.quantMercPedido), 0), 2, 'de_DE') as 'valorPedido' from acesso join consultor on acesso.codUsuario = consultor.codConsult join relacionafornecedor on consultor.codConsult = relacionafornecedor.codConsultor	join fornecedor on relacionafornecedor.codFornecedor = fornecedor.codForn left join pedido on pedido.codFornPedido = fornecedor.codForn left join mercadoria on mercadoria.codMercadoria = pedido.codMercPedido group by consultor.codConsult`;

    connection.query(queryConsult, (error, results, fields) => {
      if (error) {
        return res.status(400).send(error);
      } else {
        return res.json(results[1]);
      }
    });
    // connection.end();
  },

  async getAllUsersAssociate(req, res) {
    logger.info("Get All Users Fair");

    const queryConsult = `SET sql_mode = ''; SELECT acesso.codAcesso, acesso.direcAcesso, associado.razaoAssociado AS nomeForn, associado.cnpjAssociado AS cnpjForn, acesso.codUsuario, associado.codAssociado AS codForn, consultor.nomeConsult, consultor.cpfConsult, FORMAT(IFNULL(sum(mercadoria.precoMercadoria*pedido.quantMercPedido), 0), 2, 'de_DE') as 'valorPedido' FROM acesso join consultor on acesso.codUsuario = consultor.codConsult join relaciona on relaciona.codAssocRelaciona = consultor.codConsult join associado on associado.codAssociado = relaciona.codConsultRelaciona left join pedido on pedido.codAssocPedido = associado.codAssociado left join mercadoria on mercadoria.codMercadoria = pedido.codMercPedido group by consultor.codConsult`;

    connection.query(queryConsult, (error, results, fields) => {
      if (error) {
        return res.status(400).send(error);
      } else {
        return res.json(results[1]);
      }
    });
    // connection.end();
  },

  async migrationUsers(req, res) {
    const users = [
      {
        key: 142758553,
        level: 2,
        name: "Karoline Delevedove",
        email: "karoline.delevedove.taglia.ferre@profair.com",
        phone: "(27) 9991-8669",
        document: 11179439767,
      },
      {
        key: 113540644,
        level: 2,
        name: "Ademar Jose Favero",
        email: "ademar.jose.favero@profair.com",
        phone: "(27) 9988-2831",
        document: 96192356734,
      },
      {
        key: 331119253,
        level: 2,
        name: "João Victor Pretti Bosi",
        email: "jo.o.victor.pretti.bosi@profair.com",
        phone: "(27) 9985-9172",
        document: 8367301781,
      },
      {
        key: 130824351,
        level: 2,
        name: "Ademilsso Galter Cesconetto",
        email: "ademilsso.galter.cesconetto@profair.com",
        phone: "(27) 9994-6249",
        document: 56022212715,
      },
      {
        key: 49125941,
        level: 2,
        name: "Waldinei Bolsoni",
        email: "waldinei.bolsoni@profair.com",
        phone: "(27) 9996-9347",
        document: 8630189711,
      },
      {
        key: 461138348,
        level: 2,
        name: "Patrícia Venturim Gualberto",
        email: "patr.cia.venturim.gualberto@profair.com",
        phone: "(27) 9948-1086",
        document: 9827088742,
      },
      {
        key: 247367511,
        level: 2,
        name: "Erivelton Cortes Da Silva",
        email: "erivelton.cortes.da.silva@profair.com",
        phone: "(27) 9972-9145",
        document: 9476765704,
      },
      {
        key: 322410567,
        level: 2,
        name: "Vanusa Alves Mendes",
        email: "vanusa.alves.mendes@profair.com",
        phone: "(27) 9986-3423",
        document: 7021932677,
      },
      {
        key: 170226534,
        level: 2,
        name: "Kaique Gabriel De Paula Oliveira",
        email: "kaique.gabriel.de.paula.oliveira.@profair.com",
        phone: "(27) 9989-9693",
        document: 17253248732,
      },
      {
        key: 328271296,
        level: 2,
        name: "Gessimar Pansini",
        email: "gessimar.pansini@profair.com",
        phone: "(27) 9952-2139",
        document: 2028543701,
      },
      {
        key: 260378674,
        level: 2,
        name: "Edson Carlos Pollack",
        email: "edson.carlos.pollack@profair.com",
        phone: "(27) 9996-9852",
        document: 978393708,
      },
      {
        key: 49125821,
        level: 2,
        name: "Ricardo Santos Da Mota",
        email: "ricardo.santos.da.mota@profair.com",
        phone: "(27) 9980-0094",
        document: 6886103741,
      },
      {
        key: 510459018,
        level: 2,
        name: "Rubens Lenes Goronsio",
        email: "rubens.lenes.goronsio@profair.com",
        phone: "(27) 9980-7116",
        document: 1718698771,
      },
      {
        key: 174881748,
        level: 2,
        name: "Dalva Cesconeti",
        email: "dalva.cesconeti@profair.com",
        phone: "(27) 9946-5380",
        document: 3103567766,
      },
      {
        key: 188663127,
        level: 2,
        name: "Dalva Cesconeti",
        email: "dalva.cesconeti@profair.com",
        phone: "(27) 9946-5380",
        document: 3103566794,
      },
      {
        key: 168373378,
        level: 2,
        name: "Hans Miller Marques De Almeida",
        email: "hans.miller.marques.de.almeida@profair.com",
        phone: "(28) 9997-2198",
        document: 11956626700,
      },
      {
        key: 252333002,
        level: 2,
        name: "Osias Pires Soares",
        email: "osias.pires.soares@profair.com",
        phone: "(28) 9995-9833",
        document: 8030688750,
      },
      {
        key: 254727337,
        level: 2,
        name: "Jacson Barcelos",
        email: "jacson.barcelos@profair.com",
        phone: "(27) 9988-8363",
        document: 8683605701,
      },
      {
        key: 413924260,
        level: 2,
        name: "Alaison Ferreira Da Silva",
        email: "alaison.ferreira.da.silva@profair.com",
        phone: "(27) 9980-6292",
        document: 88478025715,
      },
      {
        key: 3534768,
        level: 2,
        name: "Joao Paulo Spadette",
        email: "joao.paulo.spadette@profair.com",
        phone: "(28) 9993-0620",
        document: 10391094700,
      },
      {
        key: 511609966,
        level: 2,
        name: "Flavio Roberto Belique Tose",
        email: "flavio.roberto.belique.tose@profair.com",
        phone: "(27) 9995-8388",
        document: 8028252737,
      },
      {
        key: 33875344,
        level: 2,
        name: "Claudiano Otoni Miranda",
        email: "claudiano.otoni.miranda@profair.com",
        phone: "(27) 9988-1061",
        document: 7304384735,
      },
      {
        key: 429248925,
        level: 2,
        name: "Juliana Monjardim Barcelos",
        email: "juliana.monjardim.barcelos@profair.com",
        phone: "(27) 9987-6609",
        document: 11208936743,
      },
      {
        key: 35407228,
        level: 2,
        name: "Eduardo Alves Almeida",
        email: "eduardo.alves.almeida@profair.com",
        phone: "(27) 9990-3253",
        document: 8373938761,
      },
      {
        key: 404717763,
        level: 2,
        name: "Junior Silva",
        email: "junior.silva@profair.com",
        phone: "(27) 9980-7983",
        document: 11039115705,
      },
      {
        key: 280653117,
        level: 2,
        name: "Joao Luiz Dias Stofel",
        email: "joao.luiz.dias.stofel@profair.com",
        phone: "(27) 9988-8453",
        document: 10966103700,
      },
      {
        key: 356675445,
        level: 2,
        name: "Americo Mattedi Junior",
        email: "americo.mattedi.junior@profair.com",
        phone: "(27) 9983-4702",
        document: 10409593770,
      },
      {
        key: 198711740,
        level: 2,
        name: "Renato Barbosa Tecchio",
        email: "renato.barbosa.tecchio@profair.com",
        phone: "(27) 9814-3916",
        document: 7759784775,
      },
      {
        key: 230372859,
        level: 2,
        name: "Backstage Teste",
        email: "backstage.teste@profair.com",
        phone: "(00) 0000-0000",
        document: 0,
      },
      {
        key: 404362918,
        level: 2,
        name: "Fernanda Cristina Bravim Rocha",
        email: "fernanda.cristina.bravim.rocha@profair.com",
        phone: "(27) 9976-4556",
        document: 14801599729,
      },
      {
        key: 174064147,
        level: 2,
        name: "Sheila Karina Armond Pires",
        email: "sheila.karina.armond.pires@profair.com",
        phone: "(27) 9977-4553",
        document: 8827302743,
      },
      {
        key: 528772055,
        level: 2,
        name: "Edinei Rodrigues Dias",
        email: "edinei.rodrigues.dias@profair.com",
        phone: "(27) 9991-0703",
        document: 5430718718,
      },
      {
        key: 45651850,
        level: 2,
        name: "Wallace Vieira Machado",
        email: "wallace.vieira.machado@profair.com",
        phone: "(27) 9975-2419",
        document: 3590261765,
      },
      {
        key: 340213686,
        level: 2,
        name: "Thiago Sodré Pretti",
        email: "thiago.sodr..pretti@profair.com",
        phone: "(27) 9997-3026",
        document: 11530429757,
      },
      {
        key: 479555751,
        level: 2,
        name: "Vandeci Inacio Da Silva",
        email: "vandeci.inacio.da.silva@profair.com",
        phone: "(27) 9988-5823",
        document: 70811989615,
      },
      {
        key: 528396504,
        level: 2,
        name: "Alex Mota",
        email: "alex.mota@profair.com",
        phone: "(27) 9982-4641",
        document: 3494984743,
      },
      {
        key: 57171165,
        level: 2,
        name: "Carlos Firmino Pires",
        email: "carlos.firmino.pires@profair.com",
        phone: "(27) 9999-3520",
        document: 7069604750,
      },
      {
        key: 446949809,
        level: 2,
        name: "Caio Coviaque",
        email: "caio.coviaque@profair.com",
        phone: "(27) 9982-7039",
        document: 15781994769,
      },
      {
        key: 160354541,
        level: 2,
        name: "Robson Pereira Da Silva",
        email: "robson.pereira.da.silva@profair.com",
        phone: "(27) 9996-5151",
        document: 8366765725,
      },
      {
        key: 393628336,
        level: 2,
        name: "Elisangela Cruz Bonfante Caliman",
        email: "elisangela.cruz.bonfante.caliman@profair.com",
        phone: "(27) 9988-6161",
        document: 9699629754,
      },
      {
        key: 477506485,
        level: 2,
        name: "Francisco Carlindo Alcino",
        email: "francisco.carlindo.alcino.leitao@profair.com",
        phone: "(27) 9995-7095",
        document: 8266424705,
      },
      {
        key: 276678796,
        level: 2,
        name: "Ferdinando Baiocco Alves",
        email: "ferdinando.baiocco.alves@profair.com",
        phone: "(27) 9985-5295",
        document: 7895971794,
      },
      {
        key: 82711752,
        level: 2,
        name: "Edlainy Prates",
        email: "edlainy.prates@profair.com",
        phone: "(27) 9971-6868",
        document: 10334448719,
      },
      {
        key: 323046203,
        level: 2,
        name: "Edilson Pereira De Novais",
        email: "edilson.pereira.de.novais@profair.com",
        phone: "(27) 9964-7800",
        document: 96061332572,
      },
      {
        key: 87773186,
        level: 2,
        name: "Jacy Ferreira De Souza",
        email: "jacy.ferreira.de.souza@profair.com",
        phone: "(27) 9984-0728",
        document: 515796778,
      },
      {
        key: 60026740,
        level: 2,
        name: "Adilson Marçal",
        email: "adilson.mar.al@profair.com",
        phone: "(27) 9963-1787",
        document: 82665729768,
      },
      {
        key: 268834379,
        level: 2,
        name: "Deivid Marçal",
        email: "deivid.mar.al@profair.com",
        phone: "(27) 9980-8325",
        document: 15392985742,
      },
      {
        key: 395319504,
        level: 2,
        name: "Jose Márcio Fiorese",
        email: "jose.m.rcio.fiorese@profair.com",
        phone: "(28) 9997-7626",
        document: 7207606745,
      },
      {
        key: 486370074,
        level: 2,
        name: "Fernando Vesper",
        email: "fernando.vesper@profair.com",
        phone: "(27) 9999-9999",
        document: 11111111111,
      },
      {
        key: 26833864,
        level: 2,
        name: "Iarles Ferreira Dos Santos",
        email: "iarles.ferreira.dos.santos@profair.com",
        phone: "(27) 9971-3614",
        document: 15938145775,
      },
      {
        key: 301871491,
        level: 2,
        name: "Ruan Lopes",
        email: "ruan.lopes.@profair.com",
        phone: "(27) 9970-2714",
        document: 4061601555,
      },
      {
        key: 29913082,
        level: 2,
        name: "Gilmar Brandao",
        email: "gilmar.brandao@profair.com",
        phone: null,
        document: 96798785700,
      },
      {
        key: 14763167,
        level: 2,
        name: "Tais Almeida",
        email: "tais.almeida@profair.com",
        phone: "(27) 9994-6826",
        document: 15166012704,
      },
      {
        key: 53105897,
        level: 2,
        name: "Jhulle Dela Costa Guarnier",
        email: "jhulle.dela.costa.guarnier@profair.com",
        phone: "(28) 9988-6067",
        document: 11949989763,
      },
      {
        key: 376301112,
        level: 2,
        name: "Claudinei Uliana Roncete",
        email: "claudinei.uliana.roncete@profair.com",
        phone: "(27) 9990-5822",
        document: 13515279750,
      },
      {
        key: 500181642,
        level: 2,
        name: "Felipe Garbo",
        email: "felipe.garbo@profair.com",
        phone: null,
        document: 14692956798,
      },
      {
        key: 448606368,
        level: 2,
        name: "Silvana Pelozato Poeira",
        email: "silvana.pelozato.poeira@profair.com",
        phone: "(27) 9952-9389",
        document: 13044179726,
      },
      {
        key: 85120967,
        level: 2,
        name: "Tiago De Souza Rizzo",
        email: "tiago.de.souza.rizzo@profair.com",
        phone: "(27) 9994-5734",
        document: 10531152707,
      },
      {
        key: 3420238,
        level: 2,
        name: "Antônio Eldo Rodrigues",
        email: "ant.nio.eldo.rodrigues.de.oliveira.@profair.com",
        phone: "(27) 9989-0576",
        document: 4577535730,
      },
      {
        key: 84361459,
        level: 2,
        name: "Renato De Souza Dias",
        email: "renato.de.souza.dias.@profair.com",
        phone: "(27) 9963-8319",
        document: 5717399707,
      },
      {
        key: 356675445,
        level: 2,
        name: "Americo Mattedi Junior",
        email: "americo.mattedi.junior@profair.com",
        phone: "(27) 9983-4702",
        document: 10409593770,
      },
      {
        key: 393489865,
        level: 2,
        name: "Gilcimara Santos De Oliveira",
        email: "gilcimara.santos.de.oliveira@profair.com",
        phone: "(27) 9885-7570",
        document: 7812102750,
      },
      {
        key: 347253158,
        level: 2,
        name: "Cleybert Sales Seixas",
        email: "cleybert.sales.seixas@profair.com",
        phone: "(27) 9968-9271",
        document: 51256150134,
      },
      {
        key: 215819284,
        level: 2,
        name: "Anderson",
        email: "anderson@profair.com",
        phone: "(27) 9884-4201",
        document: 6144944516,
      },
      {
        key: 333100091,
        level: 2,
        name: "Kevin Pereira Magalhães",
        email: "kevin.pereira.magalh.es.@profair.com",
        phone: "(27) 9970-9914",
        document: 14811676777,
      },
      {
        key: 230537188,
        level: 2,
        name: "Roger Marcelo Mocelin Tose",
        email: "roger.marcelo.mocelin.tose@profair.com",
        phone: "(27) 9979-5469",
        document: 11777329710,
      },
      {
        key: 30745801,
        level: 2,
        name: "Northon Emanuel Ferreira",
        email: "northon.emanuel.ferreira.melga.o@profair.com",
        phone: "(27) 9969-0605",
        document: 5910492799,
      },
      {
        key: 86611880,
        level: 2,
        name: "Northon Emanuel Ferreira",
        email: "northon.emanuel.ferreira.melga.o@profair.com",
        phone: "(27) 9995-0532",
        document: 5910492799,
      },
      {
        key: 223556328,
        level: 2,
        name: "Genilson Rodrigues",
        email: "genilson.rodrigues@profair.com",
        phone: "(27) 9996-3591",
        document: 86134990744,
      },
      {
        key: 78203868,
        level: 2,
        name: "Lucas Lyra Bremenkamp",
        email: "lucas.lyra.bremenkamp.@profair.com",
        phone: "(22) 9974-3998",
        document: 15412303706,
      },
      {
        key: 449348326,
        level: 2,
        name: "Israel",
        email: "israel@profair.com",
        phone: "(27) 9981-0013",
        document: 11211161757,
      },
      {
        key: 279290394,
        level: 3,
        name: "Lucas Soares",
        email: "lucas.soares@profair.com",
        phone: "(27) 9981-0013",
        document: 11211161757,
      },
      {
        key: 206250040,
        level: 3,
        name: "Higor Martins",
        email: "higor.martins@profair.com",
        phone: "(27) 9981-0013",
        document: 11211161757,
      },
      {
        key: 414249106,
        level: 3,
        name: "Edinei",
        email: "edinei@profair.com",
        phone: "(27) 9981-0013",
        document: 11211161757,
      },
      {
        key: 351191914,
        level: 3,
        name: "Fernanda",
        email: "fernanda@profair.com",
        phone: "(27) 9981-0013",
        document: 11211161757,
      },
      {
        key: 516164854,
        level: 3,
        name: "Gilmar Brandão",
        email: "gilmar.brand.o@profair.com",
        phone: "(27) 9981-0013",
        document: 11211161757,
      },
    ];

    // const jsonData = [
    //   {
    //     key: 516164854,
    //     level: 3,
    //     name: "Gilmar Brandão",
    //     email: "gilmar.brand.o@profair.com",
    //     phone: "(27) 9981-0013",
    //     document: 11211161757,
    //   },
    // ];

    const tableName = "users";

    // Build the SQL query
    const queryInsert = `INSERT INTO ${tableName} (key, level, name, email, phone, document) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`;

    connection.connect((error, client, done) => {
      if (error) {
        return console.error("Error acquiring client", error.stack);
      }

      users.forEach((data, index) => {
        const { key, level, name, email, phone, document } = data;
        const values = [key, level, name, email, phone, document];
        console.log(values);

        client.query(queryInsert, values, (err, result) => {
          console.log(queryInsert);
          if (err) {
            console.error("Error executing query", err.stack);
          } else {
            console.log(`Inserted row ${index + 1}:`, result.rows[0]);
          }
        });
      });

      done();
    });
  },
};

module.exports = User;
