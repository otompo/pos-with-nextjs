import Settings from '../models/settingsModel';
import catchAsync from '../utils/catchAsync';
import slugify from 'slugify';

export const createCompanyDetails = catchAsync(async (req, res, next) => {
  const { name } = req.body;
  let slug = slugify(name).toLowerCase();
  let settings = await new Settings({
    slug,
    ...req.body,
  }).save();

  res.status(200).send(settings);
});

export const getCurrentCompany = catchAsync(async (req, res) => {
  const settings = await Settings.find({});
  res.send(settings);
});

export const currentCompany = catchAsync(async (req, res) => {
  const { slug } = req.query;
  const settings = await Settings.findOne({ slug });
  res.send(settings);
});

export const updateCompanyDetails = catchAsync(async (req, res, next) => {
  const { image, name, address, contactNumber, email, website, description } =
    req.body;

  const { slug } = req.query;
  const settings = await Settings.findOne({ slug });
  if (image) {
    const update = await Settings.findOneAndUpdate(
      { slug: settings.slug },
      {
        slug: slugify(name).toLowerCase(),
        name: name,
        address: address,
        contactNumber: contactNumber,
        email: email,
        website: website,
        description: description,
        logo: image,
        ...req.body,
      },
      {
        new: true,
      },
    );
    res.status(200).send(update);
  } else {
    const update = await Settings.findOneAndUpdate(
      { slug: settings.slug },
      {
        slug: slugify(name).toLowerCase(),
        name: name,
        address: address,
        contactNumber: contactNumber,
        email: email,
        website: website,
        description: description,
        ...req.body,
      },
      {
        new: true,
      },
    );
    res.status(200).send(update);
  }
});
