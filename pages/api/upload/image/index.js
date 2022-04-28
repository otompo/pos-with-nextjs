import { IncomingForm } from 'formidable';

var mv = require('mv');

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req, res) => {
  const data = await new Promise((resolve, reject) => {
    const form = new IncomingForm();

    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      // console.log(fields, files);
      let oldPath = files.image.filepath;
      let url = 'http://' + req.headers.host;
      let newPath = `./public/uploads/${files.image.originalFilename}`;
      mv(oldPath, newPath, url, function (err) {});
      let newOne = `/uploads/${files.image.originalFilename}`;
      res.status(200).json(newOne);
    });
  });
};
