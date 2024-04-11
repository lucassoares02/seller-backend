const connection = require("@server");
const logger = require("@logger");
const select = require("@select");
const Insert = require("@insert");

const Notice = {

  async getAllNotice(req, res) {
    logger.info("Get All Notices");

    const queryConsult = " select * from notices order by priority desc";

    connection.query(queryConsult, (error, results, fields) => {
      if (error) {
        console.log("Error select Notices: ", error);
      } else {
        return res.json(results);
      }
    });
    // connection.end();
  },


  async getAllSchedule(req, res) {
    logger.info("Get All Schedule");

    const queryConsult = " select * from schedule";

    connection.query(queryConsult, (error, results, fields) => {
      if (error) {
        console.log("Error select Schedule: ", error);
      } else {
        return res.json(results);
      }
    });
    // connection.end();
  },




};

module.exports = Notice;
