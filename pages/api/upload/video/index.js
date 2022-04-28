import { IncomingForm } from 'formidable';
import { readFileSync } from 'fs';
import { nanoid } from 'nanoid';
import AWS from 'aws-sdk';

// dbConnect();

export const config = {
  api: { bodyParser: false },
};

export default async (req, res) => {
  const awsConfig = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    apiVersion: process.env.AWS_API_VERSION,
  };

  const S3 = new AWS.S3(awsConfig);

  const data = await new Promise((resolve, reject) => {
    const form = new IncomingForm();

    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });

  const file = data?.files;
  const params = {
    Bucket: process.env.AWS_BUCKET,
    Key: `${nanoid()}.${file.video.mimetype.split('/')[1]}`,
    Body: readFileSync(file.video.filepath),
    ACL: 'public-read',
    ContentType: file.video.mimetype,
  };

  S3.upload(params, (err, data) => {
    if (err) {
      console.log(err);
      res.send(400);
    }
    // console.log(data);
    return res.send(data);
  });
};
