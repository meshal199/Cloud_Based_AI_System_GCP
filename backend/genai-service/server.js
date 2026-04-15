const express = require('express');
const cors = require('cors');
require('dotenv').config();

const genaiRoutes = require('./routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/genai', genaiRoutes);

const PORT = process.env.PORT || 8080;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Running on ${PORT}`);
});
