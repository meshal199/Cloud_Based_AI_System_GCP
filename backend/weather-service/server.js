const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

const swaggerDocument = YAML.load(path.join(__dirname, "weather-openapi.yaml"));

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/weather", routes);

module.exports = app;
