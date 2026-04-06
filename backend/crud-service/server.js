const express = require('express');
const app = express();
const cors = require('cors');
const axios = require('axios');
app.use(express.json());
app.use(cors());

const saved_data = [];

app.get('/test', (req, res) => {
  res.json({ message: 'Service is working crud-service' });
});

app.post('/save', async (req, res) => {
  const now = new Date();
  formatTime = now.toLocaleString();
  const id = saved_data.length + 1;
  const { lastPrompt, result, type } = req.body;
  const prompt = `Create a short 3-5 word title for the following text. Respond ONLY with the title text and nothing else: ${lastPrompt}`;

  const title_response = await axios.post('http://localhost:3002/api/genai/generateText', {
    prompt,
  });

  saved_data.push({
    id,
    service: type,
    title: type == 'text' ? 'text' : 'image',
    content: title_response.data.result,
    date: formatTime,
  });
  console.log(saved_data);
  res.json({ message: 'data saved sucessfully!' });
});

app.get('/data', (req, res) => {
  res.json({ data: saved_data });
});

const PORT = 3003;
app.listen(PORT, () => console.log(`Runnig on ${PORT}`));
