const express = require("express");
const router = express.Router();
const { generateText } = require("./service");



router.post("/generate", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({
        success: false,
        message: "Prompt is required",
      });
    }

    const result = await generateText(prompt);

    res.json({
      success: true,
      prompt,
      result,
    });
  } catch (error) {
      console.error("FULL ERROR:");
    console.error(error.response?.data || error.message);

    res.status(500).json({
      success: false,
      message: "GenAI failed",
    });
  }
});

module.exports = router;