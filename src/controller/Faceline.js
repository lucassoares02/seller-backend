const { connection } = require("@server");
const logger = require("@logger");
const Select = require("@select");
const Insert = require("@insert");

const Faceline = {
  async insert(req, res) {
    logger.info("Post Save Faceline Client");

    const itens = req.body;

    let params = {
      table: "faceline",
      data: itens,
    };
    return Insert(params)
      .then(async (resp) => {
        res.json(resp);
      })
      .catch((error) => {
        res.status(400).send(error);
      });
    // connection.end();
  },

};

module.exports = Faceline;
