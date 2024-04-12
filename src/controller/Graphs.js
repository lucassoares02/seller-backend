const connection = require("@server");
const logger = require("@logger");
const Select = require("@select");
const Insert = require("@insert");
const PDFDocument = require("pdfkit");
const fs = require("fs");
// const PDFDocument = require("pdfkit-table");
const path = require("path");

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
        // Criar um novo documento PDF
        const doc = new PDFDocument({ margin: 30, size: "A4" });

        // Configurar os cabeçalhos de resposta para fazer o download
        res.setHeader("Content-Disposition", `attachment; filename="negociacoes.pdf"`);
        res.setHeader("Content-Type", "application/pdf");

        // Pipe o PDF para a resposta HTTP
        doc.pipe(res);

        // Escrever os dados no PDF
        doc.font("Helvetica-Bold").fontSize(12).text("ID Negociacao Codigo ERP Codigo de Barras Produto Complemento Marca Quantidade", { align: "left" });

        results[1].forEach((row) => {
          doc.fontSize(10).text(`${row.codMercPedido} ${row.codNegoPedido} ${row.erpcode} ${row.barcode} ${row.nomeMercadoria} ${row.complemento} ${row.marca} ${row.quantidade}`, {
            align: "left",
          });
        });

        // Finalizar o documento PDF
        doc.end();
      }
    });
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
