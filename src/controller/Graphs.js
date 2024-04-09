const connection = require("@server");
const logger = require("@logger");
const Select = require("@select");
const Insert = require("@insert");
// const PDFDocument = require("pdfkit");
const fs = require("fs");
const PDFDocument = require("pdfkit-table");

const Graphs = {
  async getPercentageClients(req, res) {
    logger.info("Get Percentage Clients");

    const { codprovider } = req.params;

    const queryConsult = `SET sql_mode = ''; SELECT (COUNT(DISTINCT pedido.codAssocPedido) * 100.0) / (SELECT COUNT(*) FROM associado) AS porcentagem, COUNT(DISTINCT pedido.codAssocPedido) AS realizados, (SELECT COUNT(*) FROM associado) AS total FROM pedido WHERE pedido.codFornPedido = ${codprovider}`;

    connection.query(queryConsult, (error, results, fields) => {
      if (error) {
        console.log("Error Select Percentage Clients: ", error);
      } else {
        return res.json(results[1]);
      }
    });
    // connection.end();
  },

  async getPercentagePovidersByClients(req, res) {
    logger.info("Get Percentage Providers by Clients");

    const { codbuyer } = req.params;

    const queryConsult = `
    SET sql_mode = ''; SELECT (COUNT(DISTINCT pedido.codFornPedido ) * 100.0) / (SELECT COUNT(*) 
    FROM fornecedor f) AS porcentagem,
    COUNT(DISTINCT pedido.codFornPedido) AS realizados, 
    (SELECT COUNT(*) FROM fornecedor f2) AS total
    FROM pedido 
    WHERE pedido.codComprPedido  = ${codbuyer}
    `;

    connection.query(queryConsult, (error, results, fields) => {
      if (error) {
        console.log("Error Select Percentage Providers by Clients: ", error);
      } else {
        return res.json(results[1]);
      }
    });
    // connection.end();
  },

  async getPercentageClientsOrganization(req, res) {
    logger.info("Get Percentage Clients Organization");

    const queryConsult = ` SET sql_mode = ''; SELECT 
    (COUNT(DISTINCT pedido.codAssocPedido) * 100.0) / (SELECT COUNT(*) FROM associado) AS porcentagem, 
    COUNT(DISTINCT pedido.codAssocPedido) AS realizados, (SELECT COUNT(*) FROM associado) AS total FROM pedido`;

    connection.query(queryConsult, (error, results, fields) => {
      if (error) {
        console.log("Error Select Percentage Clients: ", error);
      } else {
        return res.json(results[1]);
      }
    });
    // connection.end();
  },

  async getPercentageProvidersOrganization(req, res) {
    logger.info("Get Percentage Providers Organization");

    const queryConsult = `
    SET sql_mode = ''; SELECT 
    (COUNT(DISTINCT pedido.codFornPedido) * 100.0) / (SELECT COUNT(*) FROM fornecedor) AS porcentagem, 
    COUNT(DISTINCT pedido.codFornPedido) AS realizados, 
    (SELECT COUNT(*) FROM fornecedor f) AS total FROM pedido `;

    connection.query(queryConsult, (error, results, fields) => {
      if (error) {
        console.log("Error Select Percentage Providers: ", error);
      } else {
        return res.json(results[1]);
      }
    });
    // connection.end();
  },

  async getTotalValueClients(req, res) {
    logger.info("Get Total Value Clients");

    const { codprovider } = req.params;

    const queryConsult = `SET sql_mode = ''; SELECT a.razao, FORMAT(SUM(IFNULL(m.precoMercadoria * p.quantMercPedido, 0)), 2, 'de_DE') AS 'valorTotal' FROM associado AS a LEFT JOIN pedido AS p ON p.codAssocPedido = a.codAssociado LEFT JOIN relacionafornecedor AS rf ON rf.codFornecedor = p.codFornPedido LEFT JOIN mercadoria AS m ON m.codMercadoria = p.codMercPedido AND rf.codFornecedor = ${codprovider} GROUP BY a.codAssociado, a.cnpjAssociado, a.razao ORDER BY SUM(IFNULL(m.precoMercadoria * p.quantMercPedido, 0)) DESC;`;

    connection.query(queryConsult, (error, results, fields) => {
      if (error) {
        console.log("Error Select Total Value Clients: ", error);
      } else {
        return res.json(results[1]);
      }
    });
    // connection.end();
  },

  async getExportPdf(req, res) {
    logger.info("Get Exports Pdf");

    const { codprovider } = req.params;

    // Lista de mercadorias
    const listaMercadorias = [
      {
        nome: "Arroz",
        quantidade: 3,
        unidade: "CX",
        precoUnitario: 30.0,
      },
      {
        nome: "Feijão",
        quantidade: 2,
        unidade: "KG",
        precoUnitario: 12.5,
      },
      {
        nome: "Leite",
        quantidade: 1,
        unidade: "L",
        precoUnitario: 5.0,
      },
    ];

    // Variáveis
    const nome = "João da Silva";
    const idade = 30;
    const cidade = "São Paulo";

    // Criar um novo documento PDF
    const doc = new PDFDocument({ margin: 30, size: "A4" });

    // Nome do arquivo de saída
    const outputFilename = "documento.pdf";

    // Definir o tipo de conteúdo da resposta como PDF
    res.setHeader("Content-Type", "application/pdf");

    // Definir o cabeçalho para fazer o download do arquivo
    res.setHeader("Content-Disposition", `attachment; filename=${outputFilename}`);

    // Pipe o PDF para a resposta HTTP
    doc.pipe(res);

    doc.image("./assets/images/icone.png", 15, 15, { width: 30 });

    const table = {
      title: "Pedido",
      subtitle: "Mercantil BNH",
      headers: [
        { label: "Código", property: "name", width: 60, renderer: null },
        { label: "Description", property: "description", width: 210, renderer: null },
        { label: "Quantidade", property: "quantity", width: 70, renderer: null },
        { label: "Fator", property: "factor", width: 70, renderer: null },
        { label: "Preço", property: "price", width: 100, renderer: null },
        { label: "Total", property: "total", width: 80, renderer: null },
      ],
      rows: [
        ["1", "Mercadoria 1", "1", "CX", "R$105,99", "R$105,99"],
        ["23534", "Mercadoria 2", "2", "CX", "R$45,00", "R$90,00"],
        // [...],
      ],
    };
    // the magic
    doc.table(table, {
      prepareHeader: () => doc.font("Helvetica-Bold").fontSize(8),
      // prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
      //   doc.font("Helvetica").fontSize(8);
      //   indexColumn === 0 && doc.addBackground(rectRow, "blue", 0.15);
      // },
    });
    // done!
    doc.end();

    console.log(`PDF gerado e entregue em: ${outputFilename}`);
  },

  async getTotalInformations(req, res) {
    logger.info("Get Total Informations");

    const queryConsult = `SET sql_mode = ''; select
      sum(pedido.quantMercPedido * mercadoria.precoMercadoria) as total
      from pedido 
      join mercadoria on mercadoria.codMercadoria = pedido.codMercPedido 
      union 
      select
      count(associado.codAssociado) as associados
      from associado
      union
      select 
      count(fornecedor.codForn) as fornecedores
      from fornecedor
      union
      select 
      count(mercadoria.codMercadoria) as mercadorias
      from mercadoria
    `;

    connection.query(queryConsult, (error, results, fields) => {
      if (error) {
        console.log("Error Select Total Informations: ", error);
      } else {
        let data = [];
        const titles = ["Total negociado", "Associados", "Fonecedores", "Mercadorias"];

        i = 0;
        for (i = 0; i < results[1].length; i++) {
          data.push({
            title: titles[i],
            addInfo: "",
            icon: "",
            color: "",
            total: results[1][i]["total"] != null ? results[1][i]["total"] : 0,
          });
        }
        res.json(data);
      }
    });
    // connection.end();
  },
};

module.exports = Graphs;
