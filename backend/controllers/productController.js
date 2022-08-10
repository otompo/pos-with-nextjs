import Product from '../models/productModel';
import catchAsync from '../utils/catchAsync';
import slugify from 'slugify';
import AppError from '../utils/appError';
const { Parser } = require('json2csv');

// const nodemailer = require('nodemailer');

export const createProduct = catchAsync(async (req, res, next) => {
  const {
    name,
    quantity,
    costPrice,
    sellingPrice,
    expireDate,
    selectedCategory,
  } = req.body;

  let slug = slugify(name).toLowerCase();
  const alreadyExist = await Product.findOne({ slug });
  if (alreadyExist) {
    return next(new AppError('Product name already exist', 400));
  }

  const products = await new Product({
    name,
    quantity,
    expireDate,
    costPrice,
    sellingPrice,
    slug,
    category: selectedCategory,
    // user: req.user._id,
  }).save();

  res.send(products);
});

// get all works
export const getAllProducts = catchAsync(async (req, res) => {
  const products = await Product.find({})
    .sort({ createdAt: -1 })
    .populate('category', '_id name slug')
    .populate('user', '_id name');
  res.status(200).send({
    total: products.length,
    products,
  });
});

export const getSingleProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findOne({ slug: req.query.slug }).populate(
    'category',
    '_id name slug',
  );
  res.send(product);
});

// products instock
export const getProductsInstock = catchAsync(async (req, res, next) => {
  const products = await Product.find({
    $expr: { $gt: [{ $toDouble: '$quantity' }, 30] },
  })
    .populate('category', '_id name slug')
    .populate('user', '_id name');

  res.send({
    total: products.length,
    products,
  });
});

// products out of stock
export const getProductsOutOfStock = catchAsync(async (req, res, next) => {
  const products = await Product.find({
    $expr: { $lte: [{ $toDouble: '$quantity' }, 30] },
  })
    .populate('category', '_id name slug')
    .populate('user', '_id name');
  res.send({ total: products.length, products });
});

// abouttooutofstock
export const getProductAboutToOutofStock = catchAsync(
  async (req, res, next) => {
    const products = await Product.find({
      $and: [
        { $expr: { $lte: [{ $toDouble: '$quantity' }, 50] } },
        { $expr: { $gte: [{ $toDouble: '$quantity' }, 30] } },
      ],
    })
      .populate('category', '_id name slug')
      .populate('user', '_id name');
    res.send({ total: products.length, products });
  },
);

// getExpired
export const getExpiredProduct = catchAsync(async (req, res, next) => {
  const products = await Product.find({ expireDate: { $lte: new Date() } })
    .populate('category', '_id name slug')
    .populate('user', '_id name');
  res.send({ total: products.length, products });
});

// getAboutToExpire
export const getProductsAboutToExpire = catchAsync(async (req, res, next) => {
  var date = new Date();
  var date10 = new Date(date.getTime());
  date10.setDate(date10.getDate() + 10);

  const products = await Product.find({
    expireDate: { $lte: new Date(date10), $gte: new Date() },
  })
    .populate('category', '_id name slug')
    .populate('user', '_id name');
  res.send({ total: products.length, products });
});

// updateQuantity
export const updateProductQuantity = catchAsync(async (req, res, next) => {
  let { quantity, currentQty } = req.body;
  const { slug } = req.query;
  const product = await Product.findOne({ slug });
  if (!product) {
    return next(new AppError('Product not found', 404));
  }
  let newQuantity = Number(quantity) + Number(currentQty);

  const updatedProduct = await Product.findOneAndUpdate(
    { slug },
    {
      // ...req.body,
      quantity: newQuantity,
    },
    {
      new: true,
    },
  );

  res.json(updatedProduct);
});

// update product
export const updateProduct = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const { name, selectedCategory, costPrice, quantity, sellingPrice } =
    req.body;

  const { slug } = req.query;
  const product = await Product.findOne({ slug });

  const update = await Product.findOneAndUpdate(
    { slug: product.slug },
    {
      slug: slugify(name).toLowerCase(),
      name,
      category: selectedCategory,
      costPrice,
      quantity,
      sellingPrice,
      ...req.body,
    },
    {
      new: true,
    },
  );
  res.send(update);
});

// delete product
export const removeProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.query.id);

  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  const data = await Product.findByIdAndRemove(product._id);

  res.json({ message: 'Product Deleted' });
});

export const exportProductData = catchAsync(async (req, res, next) => {
  const fields = [
    'name',
    'quantity',
    'costPrice',
    'sellingPrice',
    'category',
    'expireDate',
  ];
  const opts = { fields };

  const product = await Product.find({});
  const parser = new Parser(opts);
  const csv = parser.parse(product);
  res.status(200).send(Buffer.from(csv));
});

export const importProductData = catchAsync(async (req, res, next) => {
  // console.log(req.body.csvFile);
  const data = Product.insertMany(req.body.csvFile);
  res.send(data);
});
