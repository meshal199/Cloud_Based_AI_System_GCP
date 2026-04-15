const axios = require('axios');

async function generateText(prompt) {
  const apiKey = process.env.API_KEY;
  const model = 'gemini-2.5-flash';

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const response = await axios.post(url, {
    contents: [
      {
        parts: [{ text: prompt }],
      },
    ],
  });

  return response.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';
}

async function generateImage(prompt) {
  try {
    const apiKey = process.env.CLOUDFLARE_API_TOKEN;
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;

    if (!apiKey) {
      throw new Error(
        'CLOUDFLARE_API_TOKEN is missing. Add it to backend/genai-service/.env.'
      );
    }

    if (!accountId) {
      throw new Error(
        'CLOUDFLARE_ACCOUNT_ID is missing. Add it to backend/genai-service/.env.'
      );
    }

    const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/@cf/bytedance/stable-diffusion-xl-lightning`;
    const response = await axios.post(
      url,
      {
        prompt,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        responseType: 'arraybuffer',
        timeout: 60000,
      }
    );

    const contentType = response.headers['content-type'] || 'image/png';
    const base64 = Buffer.from(response.data).toString('base64');

    return `data:${contentType};base64,${base64}`;
  } catch (error) {
    const details =
      error.response?.data && Buffer.isBuffer(error.response.data)
        ? Buffer.from(error.response.data).toString('utf8')
        : error.response?.data || error.message;

    console.error('IMAGE ERROR:', details);
    throw new Error(`Image generation failed: ${details}`);
  }
}

module.exports = { generateText, generateImage };
