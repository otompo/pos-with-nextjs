import Featureprice from '../models/featuresModel';
import Price from '../models/priceModel';
import catchAsync from '../utils/catchAsync';
import { nanoid } from 'nanoid';
import slugify from 'slugify';

export const createFeatureprice = catchAsync(async (req, res, next) => {
  let { title, price, selectedCategory, inputList } = req.body;
  let slug = slugify(title).toLowerCase() + `-${nanoid(10).toLowerCase()}`;
  const featuredata = await new Featureprice({
    slug: slug,
    title: title,
    price: price,
    category: selectedCategory,
    features: inputList,
  }).save();
  res.send(featuredata);
});

// get all works
export const getAllFeature = catchAsync(async (req, res) => {
  const data = await Featureprice.find({})
    .sort({ createdAt: -1 })
    .populate('category', '_id name slug description')
    .populate('features', '_id name');
  res.status(200).send(data);
});

export const readRelatedFeaturePrices = catchAsync(async (req, res, next) => {
  const priceCategory = await Price.findOne({ slug: req.query.slug });

  if (!priceCategory) {
    return next(new AppError('category not found', 404));
  }
  let categoryId = priceCategory._id;
  const works = await Featureprice.find({ category: categoryId })
    .populate('category', '_id title slug')
    .sort({ createdAt: -1 });
  // console.log('works', works);
  res.send(works);
});

export const readSingleFesturesPrice = catchAsync(async (req, res, next) => {
  let slug = req.query.slug;
  const data = await Featureprice.findOne({ slug })
    .populate('category', '_id name slug description')
    .populate('features', '_id name');
  if (!data) {
    return next(new AppError('data not found', 404));
  }
  res.send(data);
});

export const removeFeaturePrice = catchAsync(async (req, res, next) => {
  const featureprice = await Featureprice.findById(req.query.id);

  // const params = {
  //   Bucket: work.video.Bucket,
  //   Key: work.video.Key,
  // };
  // // send remove request to S3
  // S3.deleteObject(params, (err, data) => {
  //   if (err) {
  //     console.log(err);
  //     res.sendStatus(400);
  //   }
  // });
  if (!featureprice) {
    return next(new AppError('Work not found', 404));
  }

  const data = await Featureprice.findByIdAndRemove(featureprice._id);

  res.json({ message: 'feature price Deleted' });
});
