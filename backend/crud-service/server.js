const express = require('express');
const app = express();
const cors = require('cors');
const axios = require('axios');
const dataRoutes = require('./routes.js');

app.use(express.json());
app.use(cors());

app.use('/', dataRoutes);

const PORT = 3003;
app.listen(PORT, () => console.log(`Runnig on ${PORT}`));
