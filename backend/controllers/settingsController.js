import Settings from '../models/settingsModel';
import catchAsync from '../utils/catchAsync';
import slugify from 'slugify';

var cloudinary = require('cloudinary');

cloudinary.config({
  cloud_name: 'codesmart',
  api_key: '924552959278257',
  api_secret: 'nyl74mynmNWo5U0rzF8LqzcCE8U',
});

export const createCompanyDetails = async (req, res) => {
  try {
    const { slug } = req.body;
    const found = await Settings.findOne({ slug });

    if (found) {
      // update
      const updated = await Settings.findOneAndUpdate({ slug }, req.body, {
        new: true,
      });
      return res.json(updated);
    } else {
      // create
      const created = await new Settings(req.body).save();
      return res.json(created);
    }
  } catch (err) {
    console.log(err);
  }
};

export const getAllDetails = async (req, res) => {
  try {
    const { slug } = req.query;
    const found = await Settings.findOne({ slug });
    return res.json(found);
  } catch (err) {
    console.log(err);
  }
};
