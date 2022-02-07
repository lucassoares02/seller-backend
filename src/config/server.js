require("dotenv").config();

const mysql = require("mysql2");

var connection = mysql.createPool({
  port: process.env.MYSQL_PORT,
  host: process.env.MYSQL_HOSTNAME,
  user: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  insecureAuth: true,
});

module.exports = connection;
