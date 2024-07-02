const { connectionMultishow } = require("@server");
const logger = require("@logger");
const Select = require("@select");
const Insert = require("@insert");
const fs = require('fs');
const { format } = require('date-fns');
const querys = 'querys.txt';

const Notice = {

  async getNegotiations(req, res) {
    logger.info("Import Data Multishow");


    try {
      const buyers = await Notice.getBuyers();
      await Notice.insertBuyers(buyers);

      const stores = await Notice.getStores();
      await Notice.insertStores(stores);

      const clients = await Notice.getClients();
      await Notice.insertClients(clients);
    } catch (error) {
      console.log(`Error Intial Inserts: ${error}`)
    }

    // const queryConsult = "SELECT n.*, cn.categoria FROM multishow_b2b.negociacoes n JOIN multishow_b2b.categorias_negociacoes cn on cn.id_categoria_negociacao = n.id_categoria_negociacao where n.id_categoria_negociacao = 25 or n.id_categoria_negociacao = 26";
    const queryConsult = "select n.*, cn.categoria FROM multishow_b2b.negociacoes n JOIN multishow_b2b.categorias_negociacoes cn on cn.id_categoria_negociacao = n.id_categoria_negociacao where n.created_at > '2024-06-25 14:15:15'";

    try {
      connectionMultishow.query(queryConsult, async (error, results, fields) => {
        if (error) {
          console.log("Error Negotiation Multishow: ", error);
        } else {
          await Notice.insertNegotiation(results);
          for (let index = 0; index < results.length; index++) {
            fs.writeFileSync(querys, `UPDATE multishow_b2b.negociacoes_lojas SET id_loja = 322 WHERE id_negociacao = ${results[index]["id_negociacao"]};\n`, { encoding: 'utf8', flag: 'a' });
            try {
              console.log("==========================================================");

              const negotiations = await Notice.getNegotiationClients(results[index]["id_negociacao"]);
              await Notice.insertNegotiationClients(negotiations);

              const merchandises = await Notice.getMerchandises(results[index]["id_negociacao"]);
              await Notice.insertMerchandises(merchandises, results[index]["id_erp"], results[index]["id_fornecedor"]);

              const provider = await Notice.getProvider(results[index]["id_negociacao"]);
              await Notice.insertProvider(provider, merchandises[0]["id_comprador"]);


              console.log(`${index} - ${results[index]["id_negociacao"]} - ${results[index]["categoria"]}`);
              console.log(`Fornecedor: ${provider[0]["id_erp"]} - ${provider[0]["fornecedor"]}`)
              console.log(`Quantidade de mercadorias: ${merchandises.length}`)
            } catch (error) {
              console.log(`Error Get Merchandises: ${error}`);
            }
          }
          return res.json(results);
        }
      });
    } catch (error) {
      console.log(`Error Connection Multishow: ${error}`);
    }
  },


  getMerchandises(negotiation) {
    const queryMerchandises = `select p.*, m.marca, np.*
      from multishow_b2b.produtos p
      join multishow_b2b.negociacoes_produtos np on np.id_produto = p.id_produto
      join multishow_b2b.marcas m on m.id_marca = p.id_marca
      where np.id_negociacao = ${negotiation}`;

    return new Promise((resolve, reject) => {
      connectionMultishow.query(queryMerchandises, (error, merchandises, fields) => {
        if (error) {
          logger.error(`Error Connection Multishow Merchandises: ${error}`);
          reject(error);
        } else {
          resolve(merchandises);
        }
      });
    });
  },

  insertMerchandises(itens, negotiation, provider) {

    const data = [];

    for (let index = 0; index < itens.length; index++) {
      const element = itens[index];

      data.push({
        codFornMerc: provider,
        nomeMercadoria: element["produto"].replaceAll("'", "`").replaceAll('"', '`'),
        embMercadoria: element["embalagem"],
        fatorMerc: element["embalagem_qtde"],
        precoMercadoria: element["valor_nf_embalagem"],
        precoUnit: element["valor_nf_unitario"],
        barcode: element["codigo_barras"],
        complemento: element["complemento"].replaceAll("'", "`").replaceAll('"', '`'),
        marca: element["marca"],
        erpcode: element["id_erp"],
        nego: negotiation,
        codMercadoria_ext: element["id_produto"],
        novo_codMercadoria: element["id_produto"],
      });
    }

    let params = {
      table: "mercadoria",
      data: data,
    };

    try {
      return new Promise((resolve, reject) => {
        return Insert(params)
          .then(async (resp) => {
            resolve(resp);
          })
          .catch((error) => {
            res.status(400).send(error);
          });
      });
    } catch (error) {
      console.log(`Error Insert Merchandises: ${error}`)
    }
  },


  getNegotiationClients(negotiation) {
    const queryMerchandises = `SELECT * FROM multishow_b2b.negociacoes_lojas
      where id_negociacao = ${negotiation}`;

    return new Promise((resolve, reject) => {
      connectionMultishow.query(queryMerchandises, (error, merchandises, fields) => {
        if (error) {
          logger.error(`Error Connection Multishow Merchandises: ${error}`);
          reject(error);
        } else {
          resolve(merchandises);
        }
      });
    });
  },

  insertNegotiationClients(itens) {
    const data = [];

    for (let index = 0; index < itens.length; index++) {
      const element = itens[index];

      fs.writeFileSync(querys, `UPDATE multishow_b2b.negociacoes_lojas SET id_loja = ${element["id_loja"]} WHERE id_negociacao = ${element["id_negociacao"]} and id_negociacao_loja = ${element["id_negociacao_loja"]};\n`, { encoding: 'utf8', flag: 'a' });


      data.push({
        id_negociacao_loja: element["id_negociacao_loja"],
        id_negociacao: element["id_negociacao"],
        id_loja: element["id_loja"]
      });
    }

    let params = {
      table: "negociacao_loja",
      data: data,
    };

    try {
      return new Promise((resolve, reject) => {
        return Insert(params)
          .then(async (resp) => {
            resolve(resp);
          })
          .catch((error) => {
            res.status(400).send(error);
          });
      });
    } catch (error) {
      console.log(`Error Insert Negotiation: ${error}`)
    }

  },

  getProvider(negotiation) {
    const queryMerchandises = `select f.*
      from multishow_b2b.fornecedores f
      join multishow_b2b.negociacoes n on n.id_fornecedor = f.id_fornecedor
      where n.id_negociacao = ${negotiation}`;

    return new Promise((resolve, reject) => {
      connectionMultishow.query(queryMerchandises, (error, providers, fields) => {
        if (error) {
          logger.error(`Error Connection Multishow Providers: ${error}`);
          reject(error);
        } else {
          resolve(providers);
        }
      });
    });
  },

  getAllProvider(negotiation) {
    const query = `select f.*
      from multishow_b2b.fornecedores f
      join multishow_b2b.negociacoes n on n.id_fornecedor = f.id_fornecedor
      where n.id_negociacao = ${negotiation}`;

    return new Promise((resolve, reject) => {
      connectionMultishow.query(query, (error, providers, fields) => {
        if (error) {
          logger.error(`Error Connection Multishow Providers: ${error}`);
          reject(error);
        } else {
          resolve(providers);
        }
      });
    });
  },


  insertProvider(itens, comprador) {

    const data = [];

    for (let index = 0; index < itens.length; index++) {
      const element = itens[index];


      data.push({
        codForn: element["id_erp"],
        nomeForn: element["fornecedor"],
        razaoForn: element["fornecedor"],
        cnpjForn: element["cnpj"],
        telForn: element["id_fornecedor"],
        codCategoria: 1,
        codComprFornecedor: comprador,
        image: "",
        color: "0XFFffffff",
      });
    }

    let params = {
      table: "fornecedor",
      data: data,
    };


    try {
      return new Promise((resolve, reject) => {
        return Insert(params)
          .then(async (resp) => {
            resolve(resp);
          })
          .catch((error) => {
            res.status(400).send(error);
          });
      });
    } catch (error) {
      console.log(`Error Insert Provider: ${error}`)
    }
  },

  insertNegotiation(itens) {



    const data = [];

    for (let index = 0; index < itens.length; index++) {
      const element = itens[index];



      const date = new Date(element["prazo_entrega"]);

      data.push({
        codNegociacao: element["id_negociacao"],
        descNegociacao: element["categoria"],
        codFornNegociacao: element["id_fornecedor"],
        prazo: format(date, 'yyyy-MM-dd HH:mm:ss.SSSSSS'),
        observacao: element["observacao"],
        codNegoErp: element["id_erp"],
      });
    }

    let params = {
      table: "negociacao",
      data: data,
    };

    try {
      return new Promise((resolve, reject) => {
        return Insert(params)
          .then(async (resp) => {
            resolve(resp);
          })
          .catch((error) => {
            res.status(400).send(error);
          });
      });
    } catch (error) {
      console.log(`Error Insert Negotiation: ${error}`)
    }

  },


  getBuyers() {
    console.log("Get Buyers");
    const queryMerchandises = `select * from multishow_b2b.compradores;`;

    return new Promise((resolve, reject) => {
      connectionMultishow.query(queryMerchandises, (error, buyers, fields) => {
        if (error) {
          logger.error(`Error Connection Multishow buyers: ${error}`);
          reject(error);
        } else {
          resolve(buyers);
        }
      });
    });
  },

  insertBuyers(itens) {
    console.log("Insert Buyers");
    const data = [];

    for (let index = 0; index < itens.length; index++) {
      const element = itens[index];

      data.push({
        codCompr: element["id_comprador"],
        nomeCompr: element["comprador"],
        descCatComprador: element["comprador"],
      });
    }

    let params = {
      table: "comprador",
      data: data,
    };

    try {
      return new Promise((resolve, reject) => {
        return Insert(params)
          .then(async (resp) => {
            resolve(resp);
          })
          .catch((error) => {
            res.status(400).send(error);
          });
      });
    } catch (error) {
      console.log(`Error Insert Negotiation: ${error}`)
    }

  },

  getStores() {
    console.log("Get Stores");
    const queryMerchandises = `select * from multishow_b2b.lojas where bloqueado = 0;`;

    return new Promise((resolve, reject) => {
      connectionMultishow.query(queryMerchandises, (error, buyers, fields) => {
        if (error) {
          logger.error(`Error Connection Multishow buyers: ${error}`);
          reject(error);
        } else {
          resolve(buyers);
        }
      });
    });
  },

  insertStores(itens) {
    console.log("Insert Stores");
    const data = [];

    for (let index = 0; index < itens.length; index++) {
      const element = itens[index];

      data.push({
        codAssociado: element["id_erp"],
        razaoAssociado: element["descricao"],
        cnpjAssociado: element["cnpj"],
      });
    }

    let params = {
      table: "associado",
      data: data,
    };

    try {
      return new Promise((resolve, reject) => {
        return Insert(params)
          .then(async (resp) => {
            resolve(resp);
          })
          .catch((error) => {
            res.status(400).send(error);
          });
      });
    } catch (error) {
      console.log(`Error Insert Negotiation: ${error}`)
    }

  },

  getClients() {
    console.log("Get Clients");
    const queryMerchandises = `select l.*, l.nome, ll.id_loja from multishow_b2b.lojistas l join multishow_b2b.lojistas_lojas ll on ll.id_lojista = l.id_lojista where l.bloqueado = 0;`;

    return new Promise((resolve, reject) => {
      connectionMultishow.query(queryMerchandises, (error, buyers, fields) => {
        if (error) {
          logger.error(`Error Connection Multishow buyers: ${error}`);
          reject(error);
        } else {
          resolve(buyers);
        }
      });
    });
  },

  insertClients(itens) {
    console.log("Insert Clients");
    const data = [];

    for (let index = 0; index < itens.length; index++) {
      const element = itens[index];

      data.push({
        codConsult: element["id_lojista"],
        nomeConsult: element["nome"],
        cpfConsult: element["cpf"],
        telConsult: element["telefone"],
        emailConsult: element["email"],
        codFornConsult: element["id_loja"],
      });
    }

    let params = {
      table: "consultor",
      data: data,
    };

    try {
      return new Promise((resolve, reject) => {
        return Insert(params)
          .then(async (resp) => {
            resolve(resp);
          })
          .catch((error) => {
            res.status(400).send(error);
          });
      });
    } catch (error) {
      console.log(`Error Insert Negotiation: ${error}`)
    }

  },




};

module.exports = Notice;
