const axios = require("axios");
const {
  InferenceClient,
  InferenceClientError,
  InferenceClientProviderApiError,
} = require("@huggingface/inference");

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
  const client = new InferenceClient(apiKey);
  const models = [
    "black-forest-labs/FLUX.1-schnell",
    "stabilityai/stable-diffusion-xl-base-1.0",
  ];
  let lastError;

  for (const model of models) {
    try {
      return await client.textToImage(
        {
          provider: "hf-inference",
          model,
          inputs: prompt,
        },
        {
          outputType: "dataUrl",
        }
      );
    } catch (error) {
      lastError = error;
      console.error(`HF IMAGE ERROR (${model}):`, error.message);
    }
  }

  if (lastError instanceof InferenceClientProviderApiError) {
    throw new Error(
      "Free Hugging Face image generation is currently unavailable for this account or model. Try again later or switch to text generation."
    );
  }

  if (lastError instanceof InferenceClientError) {
    throw new Error(`HF image failed: ${lastError.message}`);
  }

  throw new Error(
    `HF image failed: ${lastError?.message || "Unknown image generation error"}`
  );
}

module.exports = { generateText, generateImage };
