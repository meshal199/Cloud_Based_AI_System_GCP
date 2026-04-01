const express = require("express");
const app = express();

app.use(express.json());

app.get("/test", (req, res) => {
  res.json({ message: "Service is working wather-service" });
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Runnig on ${PORT}`));
