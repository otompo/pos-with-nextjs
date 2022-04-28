import Review from '../models/reviewModel';
import slugify from 'slugify';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import AWS from 'aws-sdk';

const awsConfig = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  apiVersion: process.env.AWS_API_VERSION,
};

const S3 = new AWS.S3(awsConfig);

// create review
export const createReview = catchAsync(async (req, res, next) => {
  let { name, message, profileImage } = req.body;
  // console.log(name, message, profileImage);
  let slug = slugify(name).toLowerCase();
  const alreadyExist = await Review.findOne({ slug });
  if (alreadyExist) {
    return next(new AppError('Review already exist', 400));
  }

  let review = await new Review({
    slug,
    name: name,
    message: message,
    image: profileImage,
  }).save();
  res.status(200).send(review);
});

// get all review
export const getAllReviews = catchAsync(async (req, res, next) => {
  const data = await Review.find({});
  // if (!data) return res.status(400).send({ error: 'Categories not found' });
  res.status(200).send(data);
});

export const deleteReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.query.id);

  const params = {
    Bucket: review.image.Bucket,
    Key: review.image.Key,
  };
  // send remove request to S3
  S3.deleteObject(params, (err, data) => {
    if (err) {
      console.log(err);
      res.sendStatus(400);
    }
  });

  if (!review) {
    return next(new AppError('Review not found with this ID', 400));
  }

  await review.remove();

  res.status(200).json({
    success: true,
  });
});
