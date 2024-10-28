const logger = require("@logger");

const Buyer = {
  async slaClient(req, res) {
    logger.info("HALO SLA CLIENT");

    console.log(req.body.outcomes)
    console.log(req.body["outcomes"])

    return res.json(req.body.outcomes);
  }
};

module.exports = Buyer;
