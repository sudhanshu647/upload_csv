const express = require('express');
const AWS = require('aws-sdk');
const csvjson = require('csvjson');
const app = express();
const port = 3000;

const s3Bucket = process.env.S3_BUCKET;
const s3 = new AWS.S3({
  accessKeyId: process.env.YOUR_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.YOUR_AWS_SECRET_ACCESS_KEY,
});

const body = [
  {
    name: 'sudhanshu',
    age: 24,
  },
  {
    name: 'ABC',
    age: 18,
  },
  {
    name: 'DEF',
    age: 20,
  },
];

app.post('/upload-csv', (req, res) => {
  const csvData = csvjson.toCSV(body, { headers: 'key' });
  const params = {
    Bucket: s3Bucket, // pass your bucket name
    Key: `${Date.now()}-user-data.csv`, // file name
    ACL: 'public-read',
    Body: csvData,
    ContentType: 'text/csv',
  };
  s3.upload(params, (s3Err, data) => {
    if (s3Err) {
      throw s3Err;
    }
    return res.status(200).json({ message: `File uploaded successfully at ${data.Location}` });
  });
});

app.listen(port, () => { console.log("Server running up.")});
