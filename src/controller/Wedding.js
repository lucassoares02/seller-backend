const { connection } = require("@server");
const logger = require("@logger");

const Wedding = {

  async confirm(req, res) {

    logger.info("Confirmation Wedding");

    const { id } = req.query;

    const query = `update confirmado set confirmou = 1 where id = ${id}`;

    console.log(query)

    connection.query(query, (error, results) => {
      if (error) {
        console.log("Error Confirmation Wedding: ", error);
        return res.status(400).send(`message: ${error}`);
      } else {
        return res.json({ "message": "Confirmation success!" });
      }
    });

  },

  async disconfirm(req, res) {

    logger.info("Disconfirmation Wedding");

    const { id } = req.query;

    const query = `update confirmado set confirmou = 0 where id = ${id}`;

    try {
      connection.query(query, (error, results) => {
        if (error) {
          console.log("Error Desconfirmation Wedding: ", error);
          return res.status(400).send(`message: ${error}`);
        } else {
          return res.json({ "message": "Desconfirmation success!" });
        }
      });
    } catch (error) {
      logger.error(error);
      return res.status(400).send(`message: ${error}`);
    }


  }


};

module.exports = Wedding;
