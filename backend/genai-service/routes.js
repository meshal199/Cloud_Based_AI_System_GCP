const express = require("express");
const router = express.Router();
const { generateText , generateImage} = require("./service");



router.post("/generateText", async (req, res) => {
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

router.post('/generateImage', async (req,res)=>{
  try{
  const {prompt} = req.body
  console.log(prompt)
      if (!prompt || !prompt.trim()) {
      return res.status(400).json({
        success: false,
        message: "Prompt is required",
      });
    }
    const result = await generateImage(prompt)
    res.json({
      success: true,
      result: result,

    });
  }catch (error) {
    console.error("IMAGE ERROR:", error.message);

    res.status(500).json({
      success: false,
      message: error.message || "Image generation failed",
    });
  }

})

module.exports = router;