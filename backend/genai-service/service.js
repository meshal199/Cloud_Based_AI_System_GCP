const axios = require("axios");
const { InferenceClient } = require("@huggingface/inference");

async function generateText(prompt) {
  const apiKey =
    process.env.API_KEY || "AIzaSyCiJiYX-sD1tbZYnRRfE_IOmDGyH413x0g";
  if (!apiKey) {
    throw new Error("API_KEY is missing");
  }
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
  try {
    const apiKey =
      process.env.HF_API_KEY || "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";

    if (!apiKey) {
      throw new Error("HF_API_KEY is missing");
    }

    const client = new InferenceClient(apiKey);

    const image = await client.textToImage({
      model: "black-forest-labs/FLUX.1-schnell",
      inputs: prompt,
    });

    const arrayBuffer = await image.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    return `data:image/png;base64,${base64}`;
  } catch (error) {
    console.error("IMAGE ERROR:", error.message);
    throw new Error(`Image generation failed: ${error.message}`);
  }
}
module.exports = { generateText, generateImage };
