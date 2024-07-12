const { connectionMultishow } = require("@server");
const logger = require("@logger");
const Select = require("@select");
const Insert = require("@insert");
const fs = require('fs');
const { format } = require('date-fns');
const querys = 'querys.txt';
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');





const Notice = {

  capitalizeWords(phrase) {
    return phrase
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitaliza a primeira letra e deixa o restante em minúsculas
      .join(' ');
  },

  async getNegotiations(req, res) {


    const { query } = req.body;


    try {
      const buyers = await Notice.getBuyers();
      await Notice.insertBuyers(buyers);
      await Notice.insertCategories(buyers);

      const stores = await Notice.getStores();
      await Notice.insertStores(stores);
      await Notice.insertNotices();

      const clients = await Notice.getClients();
      await Notice.insertClients(clients);
      await Notice.insertAccess(clients, 2);


      const organizers = await Notice.getOrganizers();
      await Notice.insertOrganizers(organizers);
      await Notice.insertAccess(organizers, 3);


      const organizer = await Notice.getOrganizer();
      await Notice.insertOrganizer(organizer);

      const relation = await Notice.getRelationClients();
      await Notice.insertRelationClients(relation);


    } catch (error) {
      console.log(`Error Intial Inserts: ${error}`)
    }

    // const queryConsult = "SELECT n.*, cn.categoria, f.id_erp as id_erp_fornecedor FROM multishow_b2b.negociacoes n JOIN multishow_b2b.categorias_negociacoes cn on cn.id_categoria_negociacao = n.id_categoria_negociacao join multishow_b2b.fornecedores f on f.id_fornecedor = n.id_fornecedor where n.id_categoria_negociacao = 25 or n.id_categoria_negociacao = 26";
    const queryConsult = `
    SELECT n.*, cn.categoria, 
    f.id_erp as id_erp_fornecedor 
    FROM multishow_b2b.negociacoes n 
    JOIN multishow_b2b.categorias_negociacoes cn on cn.id_categoria_negociacao = n.id_categoria_negociacao 
    join multishow_b2b.fornecedores f on f.id_fornecedor = n.id_fornecedor 
    where n.validade_fim > n.validade_inicio  
    and n.id_categoria_negociacao in(25,26,27,28)`;
    // const queryConsult = "SELECT n.*, cn.categoria, f.id_erp as id_erp_fornecedor FROM multishow_b2b.negociacoes n JOIN multishow_b2b.categorias_negociacoes cn on cn.id_categoria_negociacao = n.id_categoria_negociacao join multishow_b2b.fornecedores f on f.id_fornecedor = n.id_fornecedor  where n.created_at > '2024-07-01 14:15:15'";

    try {
      connectionMultishow.query(query, async (error, results, fields) => {
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
              await Notice.insertMerchandises(merchandises, results[index]["id_negociacao"], results[index]["id_erp_fornecedor"]);

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
    console.log(negotiation)
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
        marca: element["marca"].replaceAll("'", "`").replaceAll('"', '`'),
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
        image: "https://static.vecteezy.com/system/resources/previews/012/986/755/non_2x/abstract-circle-logo-icon-free-png.png",
        color: "0XFF0763F7",
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
      var date = new Date(element["validade_fim"]);

      try {
        if (!String(element["data_fim_encarte"]).includes("Sat Dec 30 1899")) {
          date = new Date(element["data_fim_encarte"]);
        }

      } catch (error) {
        console.log(`Error Date Encarte: ${error}`)
      }

      data.push({
        codNegociacao: element["id_negociacao"],
        descNegociacao: element["categoria"],
        codFornNegociacao: element["id_erp_fornecedor"],
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
        color: "FFC400"
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

  insertCategories(itens) {
    console.log("Insert Categories");
    const data = [];

    for (let index = 0; index < itens.length; index++) {
      const element = itens[index];

      data.push({
        codCategoria: element["id_comprador"],
        descCategoria: element["comprador"],
      });
    }

    let params = {
      table: "categoria",
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

  getRelationClients() {
    console.log("Get Relation Clients");
    const queryMerchandises = `select * from lojistas_lojas ll join lojas l on l.id_loja = ll.id_loja where ll.ativa = 1`;

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

  insertRelationClients(itens) {
    console.log("Insert Relation Clients");
    const data = [];

    for (let index = 0; index < itens.length; index++) {
      const element = itens[index];

      data.push({
        codAssocRelaciona: element["id_lojista"],
        codConsultRelaciona: element["id_erp"],
      });
    }

    let params = {
      table: "relaciona",
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
        razaoAssociado: Notice.capitalizeWords(element["descricao"]),
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

  getOrganizers() {
    console.log("Get Organizers");
    const queryOrganizers = `select * from multishow_b2b.admin`;

    return new Promise((resolve, reject) => {
      connectionMultishow.query(queryOrganizers, (error, buyers, fields) => {
        if (error) {
          logger.error(`Error Connection Multishow buyers: ${error}`);
          reject(error);
        } else {
          resolve(buyers);
        }
      });
    });
  },

  insertOrganizers(itens) {
    console.log("Insert Organizers");
    function capitalizeWords(phrase) {
      return phrase
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitaliza a primeira letra e deixa o restante em minúsculas
        .join(' ');
    }
    const data = [];

    for (let index = 0; index < itens.length; index++) {
      const element = itens[index];

      data.push({
        codConsult: element["id_usuario"] + 999,
        nomeConsult: capitalizeWords(element["nome"]),
        cpfConsult: "00000000000",
        telConsult: element["usuario"],
        emailConsult: element["email"],
        // codFornConsult: element["id_loja"],
        codFornConsult: 158,
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

  getClients() {
    console.log("Get Clients");
    // const queryMerchandises = `select l.*, l.nome, ll.id_loja from multishow_b2b.lojistas l join multishow_b2b.lojistas_lojas ll on ll.id_lojista = l.id_lojista where l.bloqueado = 0;`;
    const queryMerchandises = `select * 
    from multishow_b2b.lojistas l 
    join multishow_b2b.lojistas_lojas ll on ll.id_lojista = l.id_lojista 
    join lojas lj on lj.id_loja = ll.id_loja 
    where l.bloqueado = 0 and lj.bloqueado = 0
    GROUP by l.id_lojista;`;

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
    function capitalizeWords(phrase) {
      return phrase
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitaliza a primeira letra e deixa o restante em minúsculas
        .join(' ');
    }
    const data = [];

    for (let index = 0; index < itens.length; index++) {
      const element = itens[index];

      data.push({
        codConsult: element["id_lojista"],
        nomeConsult: Notice.capitalizeWords(element["nome"]),
        cpfConsult: element["cpf"],
        telConsult: element["telefone"],
        emailConsult: element["email"],
        codFornConsult: element["id_erp"],
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

  insertAccess(itens, acessoDire) {
    console.log("Insert Access");
    function generateUniqueIntegerHash() {
      const uniqueData = uuidv4() + Date.now();
      const hash = crypto.createHash('sha256').update(uniqueData).digest('hex');
      const integerHash = parseInt(hash.substring(0, 8), 16); // Pega os primeiros 8 caracteres e converte para inteiro
      return integerHash;
    }

    const data = [];

    for (let index = 0; index < itens.length; index++) {
      const element = itens[index];

      data.push({
        codAcesso: generateUniqueIntegerHash(),
        direcAcesso: acessoDire,
        codUsuario: acessoDire == 3 ? element["id_usuario"] + 999 : element["id_lojista"],
        codOrganization: 158,
      });
    }

    let params = {
      table: "acesso",
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

  getOrganizer() {
    console.log("Get Organizer");
    const queryOrganizer = `select * from multishow_b2b.fornecedores where id_fornecedor = 1;`;

    return new Promise((resolve, reject) => {
      connectionMultishow.query(queryOrganizer, (error, buyers, fields) => {
        if (error) {
          logger.error(`Error Connection Multishow buyers: ${error}`);
          reject(error);
        } else {
          resolve(buyers);
        }
      });
    });
  },

  insertOrganizer(itens) {
    console.log("Insert Organizer");
    const data = [];

    for (let index = 0; index < itens.length; index++) {
      const element = itens[index];

      data.push({
        codOrg: 158,
        nomeOrg: element["fornecedor"],
        razaoOrg: element["fornecedor"],
        cnpjOrg: element["cnpj"],
        emailOrg: element["cnpj"],
        telOrg: element["id_fornecedor"],
        ativo: 1,
      });
    }

    let params = {
      table: "organizador",
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

  insertNotices() {
    console.log("Insert Notices");
    const data = [
      {
        codNotice: 2,
        title: "Carro obstruindo passagem",
        description: "Gentileza motorista do Gol Prata Placa: MTO3245, gentileza retirar veicula da entrada.",
        image: "",
        action: "",
        priority: 5,
        primaryColor: "",
        secondaryColor: "",
        stamp: "",
        type: 5
      },
      {
        codNotice: 3,
        title: "Promocao leve Mais Seara",
        description: "Seara esta como uma promocao especial em que leve o dobro pelo mesmo.",
        image: "",
        action: "",
        priority: 4,
        primaryColor: "",
        secondaryColor: "",
        stamp: "",
        type: 5
      },
      {
        codNotice: 1,
        title: "Conheca o Stand Show",
        description: "Conheca as instalacoes do stand da MultiShow no centro de convecoes",
        image: "",
        action: "",
        priority: 3,
        primaryColor: "",
        secondaryColor: "",
        stamp: "",
        type: 5
      },
      {
        codNotice: 4,
        title: "3º Feira de negócios",
        description: "Apresentação das funcionalidades do Profair para os fornecedores.",
        image: "",
        action: "",
        priority: 0,
        primaryColor: "0XFF0000ff",
        secondaryColor: "0XFFff0000",
        stamp: "24/05/2024",
        type: 0
      }
    ];


    let params = {
      table: "notices",
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

  refreshMerchandise(req, res) {
    logger.info("Refresh Merchandise Multishow")
    const { product, negotiation } = req.params;


    const queryMerchandises = `select n.id_erp, p.*, m.marca, np.*
    from multishow_b2b.produtos p
    join multishow_b2b.negociacoes_produtos np on np.id_produto = p.id_produto
    join multishow_b2b.marcas m on m.id_marca = p.id_marca
    join multishow_b2b.negociacoes n on n.id_negociacao  = np.id_negociacao
    where n.id_negociacao = ${negotiation} and np.id_produto = ${product}`;

    console.log(queryMerchandises);


    try {
      connectionMultishow.query(queryMerchandises, (error, merchandises, fields) => {
        if (error) {
          logger.error(`Error Connection Multishow Merchandises: ${error}`);
          return res.status;
        } else {
          console.log(merchandises);

          return merchandises.length > 0 ? res.json(
            {
              nomeMercadoria: merchandises[0]["produto"].replaceAll("'", "`").replaceAll('"', '`'),
              embMercadoria: merchandises[0]["embalagem"],
              fatorMerc: merchandises[0]["embalagem_qtde"],
              precoMercadoria: merchandises[0]["valor_nf_embalagem"],
              precoUnit: merchandises[0]["valor_nf_unitario"],
              barcode: merchandises[0]["codigo_barras"],
              complemento: merchandises[0]["complemento"].replaceAll("'", "`").replaceAll('"', '`'),
              marca: merchandises[0]["marca"],
              erpcode: merchandises[0]["id_erp"],
              nego: negotiation,
              codMercadoria_ext: merchandises[0]["id_produto"],
              codMercadoria: merchandises[0]["id_produto"],
              quantMercadoria: 0,
              volumeTotal: 0,
            }
          ) : res.json({});
        }
      });
    } catch (error) {
      return res.status(400).send(error);
    }
  },



};

module.exports = Notice;
