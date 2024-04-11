const connection = require("@server");
const logger = require("@logger");
const select = require("@select");
const Insert = require("@insert");

const Negotiation = {

  async getAllNegotiation(req, res) {
    logger.info("Get All Negotiations");

    const queryConsult = " select relaciona.codAssocRelaciona, consultor.nomeConsult, relaciona.codConsultRelaciona, associado.razaoAssociado,  associado.cnpjAssociado, FORMAT(COALESCE(sum(mercadoria.precoMercadoria*pedido.quantMercPedido),'0'), 2, 'de_DE') as 'valorTotal', sum(pedido.quantMercPedido) as 'volumeTotal' from associado join relaciona on relaciona.codConsultRelaciona = associado.codAssociado join consultor on consultor.codConsult = relaciona.codAssocRelaciona left join pedido on pedido.codAssocPedido = relaciona.codConsultRelaciona left join mercadoria on codMercadoria = pedido.codMercPedido group by relaciona.codConsultRelaciona order by sum(mercadoria.precoMercadoria*pedido.quantMercPedido) desc";

    connection.query(queryConsult, (error, results, fields) => {
      if (error) {
        console.log("Error select Users: ", error);
      } else {
        return res.json(results);
      }
    });
    // connection.end();
  },



  async getNegotiationProvider(req, res) {
    logger.info("Get Negotiation Provider");

    const { codforn } = req.params;


    const queryConsult = " select negociacao.codNegociacao, negociacao.descNegociacao, negociacao.codFornNegociacao, FORMAT(IFNULL(sum(mercadoria.precoMercadoria*pedido. quantMercPedido),0), 2, 'de_DE') as 'valorTotal', IFNULL(sum(pedido.quantMercPedido),0) as 'volumeTotal' from negociacao left join pedido on pedido.codNegoPedido = negociacao.codNegociacao left join mercadoria on mercadoria.codMercadoria = pedido.codMercPedido where negociacao.codFornNegociacao = " + codforn + " group by negociacao.codNegociacao order by sum(mercadoria.precoMercadoria*pedido.quantMercPedido) desc";


    connection.query(queryConsult, (error, results, fields) => {
      if (error) {
        console.log("Error select Negotiation Provider: ", error);
      } else {
        return res.json(results);
      }
    });
    // connection.end();
  },

  async GetExportNegotiations(req, res) {
    logger.info("Get Export Negotiation ");

    const { codforn } = req.params;


    const queryConsult = `
     select
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


        // return res.json(results);
      }
    });
    // connection.end();
  },


  async GetExportNegotiationsClient(req, res) {
    logger.info("Get Export Negotiation ");

    const { codeclient } = req.params;





    // const queryConsult = `
    //  select
    //   p.codMercPedido,
    //   m.nomeMercadoria,
    //   m.complemento,
    //   m.barcode,
    //   m.erpcode,
    //   m.marca,
    //   sum(p.quantMercPedido) as quantidade,
    //   p.codFornPedido,
    //   p.codAssocPedido,
    //   p.codNegoPedido
    //   from pedido p
    //   join mercadoria m on m.codMercadoria = p.codMercPedido
    //   where m.codMercadoria = p.codMercPedido 
    //   and p.codAssocPedido = ${codeclient}
    //   group by p.codMercPedido
    //   order by p.codNegoPedido`;

    const queryConsult = `
     select
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


    connection.query(queryConsult, async (error, results, fields) => {
      if (error) {
        console.log("Error Export Negotiation : ", error);
      } else {
        let csvData = `ID;Negociacao;Codigo ERP;Codigo de barras;Produto;Complemento;Valor;Valor (NF unitario);Valor (NF embalagem);Tipo Embalagem;Qtde. Embalagem;Qtde. Minima;Modalidade;Data inicio encarte;Data fim encarte;Termino negociacao;Marca;Estoque;Quantidade\n`;


        //=============================================================
        //=============================================================
        //=============================================================

        count = 0;
        let listMerc = [];
        const queryReusult = await new Promise(async (resolve, reject) => {
          await results[1].map(async (row) => {


            const internQuery = `select codNegociacao from relacionaMercadoria where codMercadoria = ${row.codMercPedido}`;

            const asfdasf = await new Promise(async (resolve, reject) => {
              connection.query(internQuery, (error, resultssss, fields) => {
                if (error) {
                  console.log("Error select Negotiation to Client: ", error);
                } else {
                  let data = [];
                  for (i = 0; i < resultssss.length; i++) {
                    data.push(resultssss[i]["codNegociacao"]);
                  }




                  if (data.indexOf(row.codNegoPedido) == -1) {

                    // let novaNegociacao = data[0];
                    // if (listMerc.length > 0) {

                    //   for (let i = 0; i < listMerc.length; i++) {

                    //     if (listMerc[i].mercadoria == row.codMercPedido) {
                    //       let negociacao = listMerc[i].negociacao;


                    //       if (negociacao != data[0]) {
                    //         novaNegociacao = data[0];
                    //       } else if (negociacao != data[1]) {
                    //         novaNegociacao = data[1];
                    //       }
                    //       console.log(`---`);
                    //       console.log(data);
                    //       console.log(`Mercadoria: ${row.codMercPedido}`);
                    //       console.log(`Negocicação: ${negociacao}`);
                    //       console.log(`Nova Negocicação: ${novaNegociacao}`);
                    //       console.log(`---`);
                    //     }
                    //   }
                    // }

                    csvData += `${row.codMercPedido};${data[0]};${row.erpcode};${row.barcode};${row.nomeMercadoria};${row.complemento};;;;;;;;;;;${row.marca};;${row.quantidade}\n`; // Substitua com os nomes das colunas do seu banco de dados;
                    // listMerc.push({ mercadoria: row.codMercPedido, negociacao: data[0] });

                  } else {



                    // let novaNegociacao = row.codNegoPedido;
                    // if (listMerc.length > 0) {

                    //   for (let i = 0; i < listMerc.length; i++) {
                    //     if (listMerc[i].mercadoria == row.codMercPedido) {
                    //       let negociacao = listMerc.negociacao;
                    //       if (negociacao != row.codNegoPedido) {
                    //         novaNegociacao = negociacao;
                    //       } else {
                    //         novaNegociacao = data[1];
                    //       }
                    //     }
                    //   }
                    // }

                    csvData += `${row.codMercPedido};${row.codNegoPedido};${row.erpcode};${row.barcode};${row.nomeMercadoria};${row.complemento};;;;;;;;;;;${row.marca};;${row.quantidade}\n`; // Substitua com os nomes das colunas do seu banco de dados;
                    // listMerc.push({ mercadoria: row.codMercPedido, negociacao: row.codNegoPedido });

                  }
                }
                resolve();
              });
            })
            count += 1;
            if (count == results[1].length) {
              resolve();
            }
          });
        });


        console.log("=------------------------ listMerc ----------------------------");
        console.log(listMerc);
        console.log("=------------------------ listMerc ----------------------------");

        //=============================================================
        //=============================================================
        //=============================================================

        // csvData += results[1].map((row) => {
        //   return `${row.codMercPedido};${row.codNegoPedido};${row.erpcode};${row.barcode};${row.nomeMercadoria};${row.complemento};;;;;;;;;;;${row.marca};;${row.quantidade}`; // Substitua com os nomes das colunas do seu banco de dados;
        // }).join('\n');
        const dateNow = Date.now();

        // Configurar os cabeçalhos de resposta para fazer o download
        res.setHeader('Content-Disposition', `attachment; filename = ${dateNow}negociacao.csv`);
        res.setHeader('Content-Type', 'text/csv');

        // Transmitir o arquivo CSV como resposta
        return res.send(csvData);


        // return res.json(results);
      }
    });
    // connection.end();
  },


  async GetExportNegotiationsClientTeste(req, res) {
    logger.info("Get Export Negotiation ");

    const { codeclient } = req.params;


    function verificarMercadoria(codigo, lista) {
      for (i = 0; i < lista.length; i++) {
        if (lista[i].mercadoria.codMercPedido == codigo) {
          return i; // A mercadoria foi encontrada na lista.
        }
      }
      return -1
    }


    const queryConsult = `
     select
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

    let listItens = [];
    let listNegociacoes = [];


    connection.query(queryConsult, async (error, results, fields) => {
      if (error) {
        console.log("Error Export Negotiation : ", error);
      } else {

        //=============================================================
        //=============================================================
        //=============================================================

        // Colocar no objeto:
        // 1. Código da mercadoria
        // 2. Lista de negociações
        // 3. Lista de mercadorias com todas as informações
        // Adicionar parâmetro para identificar se a negociação está correta
        // Se estiver correta remover o item da negociação da lista de negociações
        // E não verificar posteriormente.
        // Se o tamanho do array de negociações for igual a 1, somar as quantidades

        // 4. Verifica na lista de negociações possíveis qual negociação não está vinculada a nenhuma outra mercadoria
        // 5. Vou inserir esse código na mercadoria atual e remover a negociação da lista de negociações
        // 6. Verifica se a negociação daquela mercadoria está dentro das negociações possíveis
        // 7. Se estiver vou remover ela da lista de negociações
        // 8. Se para aquela mercadoria só tiver um negociação possível, vou somar as quantidades
        // 9. 


        // console.log("======================= Results =======================");
        // console.log(results[1].length);
        // console.log(results[1]);
        // console.log("======================= Results =======================");
        count = 0;

        const queryReusult = await new Promise(async (resolve, reject) => {
          await results[1].map(async (row) => {

            const internQuery = `select codNegociacao from relacionaMercadoria where codMercadoria = ${row.codMercPedido}`;

            const asfdasf = await new Promise(async (resolve, reject) => {
              connection.query(internQuery, (error, resultssss, fields) => {
                if (error) {
                  console.log("Error select Negotiation to Client: ", error);
                } else {
                  let data = [];
                  for (i = 0; i < resultssss.length; i++) {
                    data.push(resultssss[i]["codNegociacao"]);
                  }

                  const mercadoria = listNegociacoes.find(item => item.mercadoria == row.codMercPedido);

                  if (mercadoria == undefined || listNegociacoes.length == 0) {
                    listNegociacoes.push({ mercadoria: row.codMercPedido, negociacao: data });
                  }

                  console.log("mercadoria");
                  console.log(listNegociacoes);
                  console.log("mercadoria");

                  // Verifico se a mercadoria está na lista de mercadorias que será inserida
                  // console.log("******************************");
                  // console.log(row.codMercPedido);
                  // console.log(row.quantidade);
                  // console.log("******************************");

                  let verifica = verificarMercadoria(row.codMercPedido, listItens);
                  // Caso não esteja eu vou adicionar
                  if (verifica != -1) {
                    // console.log("====================================");
                    // console.log(row.codMercPedido);
                    // console.log(listItens[verifica].mercadoria.codNegoPedido);
                    // console.log(row.codNegoPedido);
                    // console.log(listItens[verifica].mercadoria.codNegoPedido == row.codNegoPedido);
                    // console.log("====================================");
                    if (listItens[verifica].mercadoria.codNegoPedido == row.codNegoPedido) {
                      novaQuantidade = listItens[verifica].mercadoria.quantidade + row.quantidade;
                      listItens[verifica].mercadoria.quantidade = novaQuantidade;
                    } else {
                      // Verifico se dentro das negociações possíveis eu tenho a que está naquela mercadoria
                      if (data.indexOf(row.codNegoPedido) == -1) {
                        // Nesse caso a código da negociação é diferente
                        // const valoresDiferentes = data.filter((element) => element != listItens[verifica].codNegoPedido);
                        // console.log("888888888888888888");
                        // console.log(`${row.codNegoPedido} - ${data[0]}`);
                        // console.log("888888888888888888");
                        row.codNegoPedido = data[0];
                        // data.splice(0, 1);
                      } else {
                        // data.splice(data.indexOf(row.codNegoPedido), 1);
                      }
                    }
                  } else {
                    let indexNego = data.indexOf(row.codNegoPedido);
                    if (indexNego == -1) {
                      row.codNegoPedido = data[0];
                      // data.splice(0, 1);
                    } else {
                      // data.splice(indexNego, 1);
                    }
                    // console.log("====================================");
                    // console.log(data);
                    // console.log(row.codNegoPedido);
                    // console.log("====================================");
                    // console.log(`Index Negociação: ${indexNego}`);

                    listItens.push({ mercadoria: row, negociacao: data });
                  }
                }
                resolve();
              });
            })
            count += 1;
            if (count == results[1].length) {
              resolve();
            }
          });
        });

        // console.log("=================================== List Itens =================================== ");
        // console.log(listItens.length);
        // console.log(listItens);
        // console.log("=================================== List Itens =================================== ");

        return res.send({ message: "Success" });

      }
    });
    // connection.end();
  },


  async GetExportNegotiationsClientTesteNovo(req, res) {
    logger.info("Get Export Negotiation ");

    const { codeclient } = req.params;


    function verificarMercadoria(codigo, lista) {
      for (i = 0; i < lista.length; i++) {
        console.log(lista[i]);
        if (lista[i].codMercPedido == codigo) {
          return i; // A mercadoria foi encontrada na lista.
        }
      }
      return -1
    }


    const queryConsult = `
     select
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

    let listItens = [];
    let listNegociacoes = [];


    connection.query(queryConsult, async (error, results, fields) => {
      if (error) {
        console.log("Error Export Negotiation : ", error);
      } else {

        count = 0;

        const queryReusult = await new Promise(async (resolve, reject) => {
          await results[1].map(async (row) => {

            const internQuery = `select codNegociacao from relacionaMercadoria where codMercadoria = ${row.codMercPedido}`;

            const asfdasf = await new Promise(async (resolve, reject) => {
              connection.query(internQuery, (error, resultssss, fields) => {
                if (error) {
                  console.log("Error select Negotiation to Client: ", error);
                } else {
                  let data = [];
                  for (i = 0; i < resultssss.length; i++) {
                    if (data.indexOf(resultssss[i]["codNegociacao"]) == -1) {
                      data.push(resultssss[i]["codNegociacao"]);
                    }
                  }

                  console.log("\n================================================");
                  console.log(`Mercadoria: ${row.codMercPedido}`);


                  const mercadoria = listNegociacoes.findIndex(item => item.mercadoria == row.codMercPedido);
                  console.log(`Index: ${mercadoria}`);



                  if (listNegociacoes[mercadoria] == undefined || listNegociacoes.length == 0) {
                    console.log("Primeira inserção na lista de negociações");
                    let indexNego = data.indexOf(row.codNegoPedido);
                    if (indexNego != -1) {
                      data.splice(indexNego, 1);
                    } else {
                      row.codNegoPedido = data[0];
                      data.splice(0, 1);
                    }

                    listNegociacoes.push({ mercadoria: row.codMercPedido, negociacao: data });
                    listItens.push(row);
                  } else {
                    console.log("Else, segunda opção caso lista de negociações não seja vazia");

                    let indexNego = listNegociacoes[mercadoria].negociacao.indexOf(row.codNegoPedido);
                    console.log(`Index da negociação ${indexNego}`);
                    if (indexNego != -1) {
                      listNegociacoes[mercadoria].negociacao.splice(indexNego, 1);
                      listItens.push(row);
                    } else {
                      console.log(`Else para confirmar que lista de negociações está vazia`);

                      // VERIFICAR ESSA CONDIÇÃO NOVAMENTE
                      if (listNegociacoes[mercadoria].negociacao.length > 0) {
                        console.log(`Lista de negociações da Mercadoria ${row.codMercPedido}`);
                        console.log(listNegociacoes[mercadoria].negociacao);
                        row.codNegoPedido = listNegociacoes[mercadoria].negociacao[0];
                        listNegociacoes[mercadoria].negociacao.splice(0, 1);
                        listItens.push(row);
                      } else {

                        let indexLista = verificarMercadoria(row.codMercPedido, listItens);

                        console.log(`Mercadoria: ${listItens[indexLista]}`)
                        console.log(`Mercadoria Detalhes: ${listItens[indexLista].codMercPedido}`)
                        console.log(`Quantidade na negociação anterior : ${listItens[indexLista].quantidade}`);

                        let novaQuantidade = listItens[indexLista].quantidade + row.quantidade;
                        listItens[indexLista].quantidade = novaQuantidade;
                        console.log(`Nova Quantidade: ${novaQuantidade}`);
                      }
                    }

                  }
                }
                resolve();
              });
            })
            count += 1;
            if (count == results[1].length) {
              resolve();
            }
          });
        });

        console.log("\n================================================\n");


        let csvData = `ID;Negociacao;Codigo ERP;Codigo de barras;Produto;Complemento;Valor;Valor (NF unitario);Valor (NF embalagem);Tipo Embalagem;Qtde. Embalagem;Qtde. Minima;Modalidade;Data inicio encarte;Data fim encarte;Termino negociacao;Marca;Estoque;Quantidade\n`;

        csvData += listItens.map((row) => {
          return ` ${row.codMercPedido};${row.codNegoPedido};${row.erpcode};${row.barcode};${row.nomeMercadoria};${row.complemento};;;;;;;;;;;${row.marca};;${row.quantidade}`; // Substitua com os nomes das colunas do seu banco de dados



        }).join('\n');

        const dateNow = Date.now();

        // Configurar os cabeçalhos de resposta para fazer o download
        res.setHeader('Content-Disposition', `attachment; filename=${dateNow}_negociacoes.csv`);
        res.setHeader('Content-Type', 'text/csv');


        console.log("=================================== List Itens =================================== ");
        console.log(listItens.length);
        console.log(listItens);
        console.log("=================================== List Itens =================================== ");

        // Transmitir o arquivo CSV como resposta
        return res.send(csvData);


        // return res.send({ message: "Success" });

      }
    });
    // connection.end();
  },



  async getRelacionaNegociacaoMercadoria(codMercPedido) {
    const internQuery = `select codNegociacao from relacionaMercadoria where codMercadoria = ${codMercPedido}`;
    let negociacao = row.codNegoPedido;
    let data = [];

    connection.query(internQuery, (error, results, fields) => {
      if (error) {
        console.log("Error select Negotiation to Client: ", error);
      } else {
        for (i = 0; i < results.length; i++) {
          data.push(results[i]["codNegociacao"]);
        }

        // console.log("-----------------------------------------");
        // if (data.indexOf(row.codNegoPedido) == -1) {
        //   console.log(row.codMercPedido);
        //   console.log(data[0]);
        //   negociacao = data[0];

        // }
        // console.log("-----------------------------------------");
      }
    });
    return data;
  },


  async getNegotiationClient(req, res) {
    logger.info("Get Negotiation to Client");

    const { codclient, codforn } = req.params;


    const queryConsult = " select codNegociacao,prazo, observacao, descNegociacao, (pedido.codNegoPedido) as 'confirma' from negociacao left outer join pedido on (negociacao.codNegociacao = pedido.codNegoPedido) and pedido.codAssocPedido = " + codclient + "	where negociacao.codFornNegociacao  = " + codforn + " GROUP BY negociacao.codNegociacao ORDER BY confirma desc";


    connection.query(queryConsult, (error, results, fields) => {
      if (error) {
        console.log("Error select Negotiation to Client: ", error);
      } else {
        return res.json(results);
      }
    });
    // connection.end();
  },

  async getNegotiationClientWithPrice(req, res) {
    logger.info("Get Negotiation to Client");

    const { codclient, codforn } = req.params;


    const queryConsult = `
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
        console.log("Error select Negotiation to Client: ", error);
      } else {
        return res.json(results);
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
