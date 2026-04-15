require('dotenv').config();

const express = require('express');
const cors = require('cors');

const weather = require('./routes');
const app = express();

app.use(cors());
app.use(express.json());

app.use('/', weather);

module.exports = app;
