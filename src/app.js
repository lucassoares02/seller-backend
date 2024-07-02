const express = require("express");
const cors = require("cors");
const app = express();
require("newrelic");

const routes = require("@routes");

app.use(cors({ origin: "*", allowedHeaders: "X-Requested-With, Content-Type, codacesso, action, platform", }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/", routes); ''

module.exports = app;
