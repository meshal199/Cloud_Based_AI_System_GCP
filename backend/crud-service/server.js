const express = require("express");
const app = express();
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const path = require("path");

const dataRoutes = require("./routes.js");

// Image saves include base64 data URLs, which exceed Express's default 100kb JSON limit.
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cors());

app.use("/", dataRoutes);
const swaggerDocument = YAML.load(path.join(__dirname, "crud-openapi.yaml"));

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = 8080;
app.listen(PORT, "0.0.0.0", () => console.log(`Runnig on ${PORT}`));
