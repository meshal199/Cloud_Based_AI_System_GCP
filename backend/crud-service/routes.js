const express = require('express');
const router = express.Router();
const multer = require('multer');
const { collection, bucket, bucketName } = require('./db.js');

const upload = multer({ storage: multer.memoryStorage() });

// POST save data
router.post('/data', upload.single('image'), async (req, res) => {
  try {
    const { lastPrompt, result, type } = req.body;
    let storedResult = result;
    let fileUrl = null;

    if (type === 'image') {
      if (!req.file) {
        return res.status(400).json({ error: 'Image file is required' });
      }

      const mimeType = req.file.mimetype || 'image/png';
      let extension = 'png';

      if (mimeType === 'image/jpeg') extension = 'jpg';
      if (mimeType === 'image/webp') extension = 'webp';

      const fileName = `images/${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`; //random number to avoid collsion
      const file = bucket.file(fileName);

      await file.save(req.file.buffer, {
        metadata: {
          contentType: mimeType,
        },
      });

      fileUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;
      storedResult = fileUrl;
    }

    const docRef = await collection.add({
      prompt: lastPrompt,
      title: 'new title',
      type,
      result: storedResult,
      fileUrl,
      createdAt: new Date().toISOString(),
    });

    res.json({
      message: 'Saved',
      id: docRef.id,
      result: storedResult,
      fileUrl,
    });
  } catch (err) {
    console.error('POST /data error:', err);
    res.status(500).json({ error: 'Failed to save data' });
  }
});

// GET all data
router.get('/data', async (req, res) => {
  try {
    const snapshot = await collection.orderBy('createdAt', 'desc').get();

    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json({ data });
  } catch (err) {
    console.error('GET /data error:', err);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

// DELETE all data
router.delete('/data', async (req, res) => {
  try {
    const snapshot = await collection.get();

    const deletes = snapshot.docs.map(async (doc) => {
      const data = doc.data();

      if (data.fileUrl) {
        const prefix = `https://storage.googleapis.com/${bucketName}/`;
        const filePath = data.fileUrl.replace(prefix, '');
        if (filePath) {
          await bucket
            .file(filePath)
            .delete()
            .catch(() => {});
        }
      }

      return collection.doc(doc.id).delete();
    });

    await Promise.all(deletes);

    res.json({ message: 'All data deleted' });
  } catch (err) {
    console.error('DELETE /data error:', err);
    res.status(500).json({ error: 'Failed to delete data' });
  }
});

// DELETE one by id
router.delete('/data/:id', async (req, res) => {
  try {
    const docRef = collection.doc(req.params.id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ message: 'Item not found' });
    }

    const data = doc.data();

    if (data.fileUrl) {
      const prefix = `https://storage.googleapis.com/${bucketName}/`;
      const filePath = data.fileUrl.replace(prefix, '');
      if (filePath) {
        await bucket
          .file(filePath)
          .delete()
          .catch(() => {});
      }
    }

    await docRef.delete();

    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    console.error('DELETE /data/:id error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
