import Category from '../models/categoryModel';
import slugify from 'slugify';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';

export const createCategory = catchAsync(async (req, res, next) => {
  const { name } = req.body;
  let slug = slugify(name).toLowerCase();
  const alreadyExist = await Category.findOne({ slug });
  if (alreadyExist) {
    return next(new AppError('Category name already exist', 400));
  }

  let category = await new Category({
    name: name,
    slug,
  }).save();

  res.status(200).send(category);
});

// get all category
export const getAllCategories = catchAsync(async (req, res, next) => {
  const category = await Category.find({}).sort({ createdAt: -1 });
  // if (!data) return res.status(400).send({ error: 'Categories not found' });
  res.status(200).send({
    total: category.length,
    category,
  });
});

export const deleteCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findById(req.query.id);
  if (!category) {
    return next(new AppError('Category not found with this ID', 400));
  }

  await category.remove();

  res.status(200).json({
    success: true,
  });
});
