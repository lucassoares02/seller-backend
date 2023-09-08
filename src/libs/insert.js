const connection = require("./../config/server");

async function Insert(params) {
  console.log("Function Insert");

  const table = params.table;
  const data = params.data;

  if (table !== undefined && data !== undefined) {
    const columnsData = Object.keys(data);
    const valuesData = Object.values(data);

    const query =
      "INSERT INTO " +
      table +
      " (" +
      columnsData.join(",") +
      ") VALUES ('" +
      valuesData.join("','") +
      "')";

    return new Promise(function (resolve, reject) {
      connection.getConnection(function (err, connectionTeste) {
        connectionTeste.query(query, function (error, results, fields) {
          if (error) return reject(error);
          connectionTeste.release();
          return resolve(results);
        });
      });
    });
  } else {
    return "No Data Received!";
  }
}

module.exports = Insert;
