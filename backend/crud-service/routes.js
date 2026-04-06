const express = require('express');
const router = express.Router();
const SavedData = require('./db.js');
router.post('/data', async (req, res) => {
  const { lastPrompt, result, type } = req.body;
  const prompt = `Create a short 3-5 word title for the following text. Respond ONLY with the title text and nothing else: ${lastPrompt}`;

  // const title_response = await axios.post('http://localhost:3002/api/genai/generateText', {
  //   prompt,
  // });
  const newData = new SavedData({
    prompt: lastPrompt,
    title: 'now this is placeholder for the title', // title_response.data.result,
    type: type,
    result:
      'welcome to the data base currently we ran out of quota will serve you as soon as we can',
  });

  await newData.save();

  res.json({ message: 'Saved to MongoDB!', id: newData._id });
});

router.get('/data', async (req, res) => {
  const alldata = await SavedData.find({});
  console.log(alldata);
  res.json({ data: alldata });
});

router.delete('/data', async (req, res) => {
  await SavedData.deleteMany()
    .then(res.json({ message: 'data deleted' }))
    .catch((err) => res.status(500).json({ message: err }));
});

router.delete('/data/:id', async (req, res) => {
  try {
    const result_deleting = await SavedData.findByIdAndDelete(req.params.id);
    if (!result_deleting) {
      res.status(404).json({ message: 'Item not found' });
    }
    res.json({ messaeg: 'item deleted secssfully', data: result_deleting });
  } catch (err) {
    res.status(500).json({ message: 'error in server ', error: err.messaeg });
  }
});
module.exports = router;
