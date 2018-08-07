const AWS = require("aws-sdk");
const s3 = new AWS.S3();

const mime = require("mime");

const path = require("path");

// allow us to use .env values
require("dotenv").load();

const s3Upload = file => {
  const fs = require("fs");
  const stream = fs.createReadStream(file);

  const params = {
    ACL: "public-read",
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `${new Date().toISOString().split("T")[0]}-${path.basename(
      stream.path
    )}`,
    Body: stream,
    contentType: mime.getType(stream)
  };

  return new Promise((resolve, reject) => {
    s3.upload(params, (err, data) => {
      err ? reject(err) : resolve(data);
    });
  });
};

module.exports = s3Upload;
