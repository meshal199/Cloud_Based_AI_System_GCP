const axios = require("axios");

async function generateText(prompt) {
  const apiKey = process.env.API_KEY;
  const model = "gemini-2.5-flash";

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const response = await axios.post(url, {
    contents: [
      {
        parts: [{ text: prompt }],
      },
    ],
  });

  return (
    response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response"
  );
}

module.exports = { generateText };