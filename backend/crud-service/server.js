const express = require("express");
const app = express();
const cors = require('cors')

app.use(express.json());
app.use(cors());

const saved_data =[ {

      id: 1,
      service: "Weather",
      title: "Weather for Tabuk",
      content: "Temperature: 32°C, clear sky, humidity 58%",
      date: "2026-04-01 10:30 AM",
    },
    {
      id: 2,
      service: "GenAI",
      title: "Text Generation",
      content: "Generated a travel plan for a 3-day trip in Riyadh.",
      date: "2026-04-01 11:15 AM",
    },
    {
      id: 3,
      service: "GenAI",
      title: "Image Generation",
      content: "Generated an AI image based on a sunset city skyline prompt.",
      date: "2026-04-01 12:05 PM",
    },]

app.get("/test", (req, res) => {
  res.json({ message: "Service is working crud-service" });
});


app.post('/save', (req,res)=>{
  const {lastPrompt, result, type } = req.body
  saved_data.push({lastPrompt, result, type})
  console.log(saved_data) 
  res.json({message:'data saved sucessfully!'})
})


app.get('/data', (req,res)=>{
  console.log('data sent')
  res.json({data: saved_data})
})

const PORT = 3003;
app.listen(PORT, () => console.log(`Runnig on ${PORT}`));
