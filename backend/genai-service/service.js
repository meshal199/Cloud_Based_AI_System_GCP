const axios = require("axios");
console.log(process.env.HF_API_KEY)
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



async function generateImage(prompt) {
  const apiKey = process.env.HF_API_KEY;

  try {
    const response = await axios.post(
      "https://router.huggingface.co/hf-inference/models/stabilityai/stable-diffusion-xl-base-1.0",
      {
        inputs: prompt
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
               Accept: "image/png",
        },
        responseType: "arraybuffer"
      }
    );

    const base64 = Buffer.from(response.data).toString("base64");
    return `data:image/png;base64,${base64}`;
  } catch (error) {
    const body = error.response?.data
      ? Buffer.from(error.response.data).toString("utf8")
      : error.message;

    console.error("HF IMAGE ERROR:", error.response?.status, body);
    throw new Error(`HF image failed: ${error.response?.status} ${body}`);
  }
}


module.exports = { generateText, generateImage };