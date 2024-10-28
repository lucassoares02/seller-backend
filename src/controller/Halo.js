const logger = require("@logger");

const Buyer = {
  async slaClient(req, res) {
    logger.info("HALO SLA CLIENT");

    console.log(req.body)

    return res.json(req.body);
  }
};

module.exports = Buyer;
