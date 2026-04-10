const express = require('express');
const app = express();
const cors = require('cors');

const dataRoutes = require('./routes.js');

// Image saves include base64 data URLs, which exceed Express's default 100kb JSON limit.
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cors());

app.use('/', dataRoutes);

const PORT = 8080;
app.listen(PORT, '0.0.0.0', () => console.log(`Runnig on ${PORT}`));
