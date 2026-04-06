const mongoose = require('mongoose');
require('dotenv').config();

mongoose
  .connect(`${process.env.MONGOOSE_BASE_URL}/myDatabase`)
  .then(() => console.log('connected to mongoDB!'))
  .catch((err) => console.error(err));

const responseSchema = new mongoose.Schema(
  {
    prompt: String,
    title: String,
    type: String,
    result: String,
  },
  { timestamps: true }
);

const SavedData = mongoose.model('SavedData', responseSchema);

module.exports = SavedData;
