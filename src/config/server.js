require("dotenv").config();
const { Pool } = require('pg');
const mysql2 = require("mysql2");
const mysql = require("mysql");


if (process.env.DATABASE == "POSTGRESQL") {
  console.log("POSTGRESQL");
  var connection = new Pool({
    user: process.env.PG_USERNAME,
    host: process.env.PG_HOSTNAME,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
    // insecureAuth: true,
    ssl: {
      rejectUnauthorized: false,
    }
  });
} else {
  console.log("MYSQL");
  // var connection = mysql.createPool({
  var connection = mysql.createConnection({
    port: process.env.MYSQL_PORT,
    host: process.env.MYSQL_HOSTNAME,
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    insecureAuth: true,
    connectionLimit: 10,
  });
}


module.exports = connection;
