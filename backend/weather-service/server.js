require("dotenv").config();

const express = require("express");
const axios = require("axios");
const cors = require("cors");


const weather = require('./routes')
const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;




// Main weather route
app.use('/',weather)
// Start server
app.listen(PORT, () => {
  console.log(`🚀 Weather service running on http://localhost:${PORT}`);
});