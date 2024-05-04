const logger = require("@logger");
const connection = require("./../config/server");

async function Insert(params) {
  console.log("Function Insert");

  const table = params.table;
  const data = params.data;

  if (table !== undefined && data !== undefined) {
    // const columnsData = Object.keys(data);
    // const valuesData = Object.values(data);

    const primeiraMercadoria = data[0];
    const columnsData = Object.keys(primeiraMercadoria);

    const valuesData = data.map((item) => columnsData.map((coluna) => `"${item[coluna]}"`).join(","));

    // const query = "INSERT INTO " + table + " (" + columnsData.join(",") + ") VALUES (" + valuesData.join("','") + "')";
    const query = "INSERT INTO " + table + " (" + columnsData.join(",") + ") VALUES (" + valuesData.join("), (") + ")";

    console.log("========================== QUERY ================================");
    console.log(query);
    console.log("========================== QUERY ================================");

    return new Promise(function (resolve, reject) {
      connection.query(query, function (error, results, fields) {
        if (error) {
          logger.error(error);
          return reject(error);
        }
        // Se houver warnings, eles estarão em results e podem ser acessados assim:
        if (results && results.warningCount > 0) {
          logger.warn("Warnings retornados pela consulta:", results.message);
        }
        logger.info(results);
        return resolve(results);
      });
    });
  } else {
    return "No Data Received!";
  }
}

module.exports = Insert;
