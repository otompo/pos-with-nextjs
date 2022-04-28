import Ourworks from '../models/ourworksModel';
import Category from '../models/categoryModel';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import { nanoid } from 'nanoid';
import slugify from 'slugify';
import AWS from 'aws-sdk';

const awsConfig = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  apiVersion: process.env.AWS_API_VERSION,
};

const S3 = new AWS.S3(awsConfig);

// create new work
export const createOurWorks = catchAsync(async (req, res) => {
  const { name, video, description, selectedCategory } = req.body;

  let work = await new Ourworks({
    slug: slugify(name) + `-${nanoid(10)}`,
    name: name,
    video: video,
    description: description,
    category: selectedCategory,
  }).save();

  res.send({
    total: work.length,
    work,
  });
});

// get all works
export const getAllWorks = catchAsync(async (req, res) => {
  const data = await Ourworks.find({})
    .sort({ createdAt: -1 })
    .populate('category', '_id title slug');
  res.status(200).send(data);
});

export const relatedWorks = catchAsync(async (req, res, next) => {
  const category = await Category.findOne({ slug: req.query.slug });

  if (!category) {
    return next(new AppError('category not found', 404));
  }
  let categoryId = category._id;
  const works = await Ourworks.find({ category: categoryId })
    .populate('category', '_id title slug')
    .sort({ createdAt: -1 });
  // console.log('works', works);
  res.send(works);
});
