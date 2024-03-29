const express = require('express');
const cors = require('cors');
const app = express();
require('newrelic');

const routes = require('@routes');


app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/', routes);



module.exports = app;

