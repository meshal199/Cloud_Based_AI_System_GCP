const express = require("express");
const cors = require("cors");
require("dotenv").config();
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const path = require("path");

const genaiRoutes = require("./routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/genai", genaiRoutes);

const swaggerDocument = YAML.load(path.join(__dirname, "genai-openapi.yaml"));

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = process.env.PORT || 8080;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Running on ${PORT}`);
});
