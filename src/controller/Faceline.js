const { connection } = require("@server");
const logger = require("@logger");
const Insert = require("@insert");

const Faceline = {
  async insert(req, res) {
    logger.info("Post Save Faceline Client");

    const { client, datetime, button1, button2, button3, button4, button5, button6, button7, button8, button_whatsApp, button_Oferta1, button_Oferta2, button_Oferta3, percentage } = data;

    // Verificar se o cliente já existe
    const selectQuery = `SELECT * FROM faceline WHERE client = client`;

    connection.query(selectQuery, [client], (err, results) => {
        if (err) throw err;

        if (results.length > 0) {
            // Se o cliente existir, atualize as informações
            const updateQuery = `
                UPDATE faceline
                SET datetime = ?, button1 = ?, button2 = ?, button3 = ?, button4 = ?, button5 = ?, button6 = ?, button7 = ?, button8 = ?, button_whatsApp = ?, button_Oferta1 = ?, button_Oferta2 = ?, button_Oferta3 = ?, percentage = ?
                WHERE client = ?
            `;

            connection.query(updateQuery, [datetime, button1, button2, button3, button4, button5, button6, button7, button8, button_whatsApp, button_Oferta1, button_Oferta2, button_Oferta3, percentage, client], (err, results) => {
                if (err) throw err;
                console.log('Cliente atualizado com sucesso!');
            });

        } else {
            // Se o cliente não existir, insira um novo registro
            const insertQuery = `
                INSERT INTO faceline (client, datetime, button1, button2, button3, button4, button5, button6, button7, button8, button_whatsApp, button_Oferta1, button_Oferta2, button_Oferta3, percentage)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            connection.query(insertQuery, [client, datetime, button1, button2, button3, button4, button5, button6, button7, button8, button_whatsApp, button_Oferta1, button_Oferta2, button_Oferta3, percentage], (err, results) => {
                if (err) throw err;
                console.log('Cliente inserido com sucesso!');
            });
        }
    });
}


};

module.exports = Faceline;
