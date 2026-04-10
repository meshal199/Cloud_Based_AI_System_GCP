const { Firestore } = require('@google-cloud/firestore');
const { Storage } = require('@google-cloud/storage');
const db = new Firestore({
  projectId: 'coe558-252-project-meshal',
  databaseId: 'project-coe558',
});

const collection = db.collection('genai_history');

const storage = new Storage({
  projectId: 'coe558-252-project-meshal',
});

const bucketName = 'coe558-meshal-genai-storage';
const bucket = storage.bucket(bucketName);

module.exports = { db, collection, bucket, bucketName };
