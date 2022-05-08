import Sales from '../models/salesModel';
import Product from '../models/productModel';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import slugify from 'slugify';
import { nanoid } from 'nanoid';
import categoryModel from '../models/categoryModel';
const moment = require('moment');

export const createSales = catchAsync(async (req, res, next) => {
  // console.log(req.body);
  // return;
  const {
    grandTotal,
    quantitySold,
    paymentMethod,
    paidAmount,
    cart,
    subTotal,
    totalTax,
  } = req.body;
  let balanceTotal = (Number(paidAmount) - Number(grandTotal)).toFixed(2);
  // let grandTotal = subTotal + totalTax;
  const newSales = new Sales({
    saler: req.user._id,
    quantitySold,
    subTotal,
    totalTax,
    grandTotal,
    paymentMethod,
    products: cart,
    balance: balanceTotal,
  });

  cart.filter((item) => {
    return count(item._id, item.count, item.quantity);
  });

  await newSales.save();

  res.json({
    msg: 'Order success! We will contact you to confirm the order.',
    newSales,
  });
});

const count = async (id, count, oldInStock) => {
  await Product.findOneAndUpdate(
    { _id: id },
    {
      quantity: oldInStock - count,
      // sold: count + oldSold,
    },
  );
};

export const getAllSales = catchAsync(async (req, res, next) => {
  const sales = await Sales.find({});
  res.send({
    total: sales.length,
    sales,
  });
});

export const getSalesByUser = catchAsync(async (req, res, next) => {
  const sales = await Sales.find({ saler: req.user._id })
    .populate('saler', 'id name')
    .sort({
      createdAt: -1,
    });
  res.send({
    total: sales.length,
    sales,
  });
});

export const getSalesByUserLimit = catchAsync(async (req, res, next) => {
  const sales = await Sales.find({ saler: req.user._id })
    .populate('saler', 'id name')
    .limit(1)
    .sort({
      createdAt: -1,
    });
  res.send(sales);
});

// GET total sales for the selected day
export const totalSalesForSelectedDay = catchAsync(async (req, res, next) => {
  // if date is provided
  const { salesStartDate, salesEndDate } = req.query;
  // console.log(req.query);
  if (salesStartDate && salesEndDate) {
    startDate = new Date(salesStartDate);
    startDate.setHours(0, 0, 0, 0);

    endDate = new Date(salesEndDate);
    endDate.setHours(23, 59, 59, 999);
  } else {
    // beginning of current day
    var startDate = new Date();
    startDate.setHours(0, 0, 0, 0);

    // end of current day
    var endDate = new Date();
    endDate.setHours(23, 59, 59, 999);
  }

  Sales.find(
    { dateTime: { $gte: startDate.toJSON(), $lte: endDate.toJSON() } },
    function (err, docs) {
      var result = {
        dateTime: startDate,
      };

      if (docs) {
        var grandTotal = docs.reduce(function (p, c) {
          return p + c.grandTotal;
        }, 0.0);

        result.grandTotal = parseFloat(parseFloat(grandTotal).toFixed(2));

        res.send(result);
      } else {
        result.grandTotal = 0;
        res.send(result);
      }
    },
  );
});

// GET sales for a particular date
export const getSalesForaParticulardate = catchAsync(async (req, res, next) => {
  if (req.query.startdate && req.query.enddate) {
    startDate = new Date(req.query.startdate);
    startDate.setHours(0, 0, 0, 0);

    endDate = new Date(req.query.enddate);
    endDate.setHours(23, 59, 59, 999);
  } else {
    // beginning of current day
    var startDate = new Date();
    startDate.setHours(0, 0, 0, 0);

    // end of current day
    var endDate = new Date();
    endDate.setHours(23, 59, 59, 999);
  }

  Sales.find(
    { dateTime: { $gte: startDate.toJSON(), $lte: endDate.toJSON() } },
    function (err, docs) {
      if (docs)
        res.send({
          total: docs.length,
          docs,
        });
    },
  );
});

export const getSalesChartInfo = catchAsync(async (req, res, next) => {
  if (req.query.startdate && req.query.enddate) {
    startDate = new Date(req.query.startdate);
    startDate.setHours(0, 0, 0, 0);

    endDate = new Date(req.query.enddate);
    endDate.setHours(23, 59, 59, 999);
  } else {
    // beginning of current day
    var startDate = new Date();
    startDate.setHours(0, 0, 0, 0);

    // end of current day
    var endDate = new Date();
    endDate.setHours(23, 59, 59, 999);
  }
  Sales.aggregate([
    {
      $project: {
        grandTotal: 1,
        month: { $month: '$dateTime' },
      },
    },
    {
      $group: {
        _id: '$month',
        total: { $sum: { $toDouble: '$grandTotal' } },
      },
    },
  ]).then((documents) => {
    res.status(200).json({
      message: 'sales chart details obtaine sucessfully',
      sales: documents,
    });
  });
});

export const getTourStats = catchAsync(async (req, res) => {
  try {
    const stats = await Sales.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } },
      },
      {
        $group: {
          _id: { $toUpper: '$difficulty' },
          numTours: { $sum: 1 },
          numRating: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          totalPrice: { $sum: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
      {
        $sort: { avgPrice: 1 },
      },
      // {
      //   $match: { _id:{$ne:'EASY'} },
      // },
    ]);
    res.status(200).json({
      status: 'success',
      data: {
        stats,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error,
    });
  }
});

// get monthly plan - ADMIN   =>   /api/admin/bookings/bookingstats
export const getMonthlyPlan = catchAsync(async (req, res, next) => {
  const dailySales = await Sales.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        numOfSales: { $sum: 1 },
        totalSales: { $sum: '$grandTotal' },
        avgPrice: { $avg: '$grandTotal' },
        minPrice: { $min: '$grandTotal' },
        maxPrice: { $max: '$grandTotal' },
        quantitySold: { $sum: '$quantitySold' },
      },
    },
    { $sort: { _id: -1 } },
  ]);

  const sales = await Sales.aggregate([
    {
      $group: {
        _id: null,
        totalSales: { $sum: '$grandTotal' },
        quantitySold: { $sum: '$quantitySold' },
        avgSales: { $avg: '$grandTotal' },
        minSales: { $min: '$grandTotal' },
        maxSales: { $max: '$grandTotal' },
      },
    },
    {
      $sort: {
        avgSales: -1,
      },
    },
  ]);

  const productStats = await Product.aggregate([
    {
      $group: {
        _id: null,
        totalProducts: { $sum: 1 },
        totalPrice: { $sum: '$discountPrice' },
        totalQuantity: { $sum: '$quantity' },
        totalTax: { $sum: '$tax' },
        avgPrice: { $avg: '$discountPrice' },
        minPrice: { $min: '$discountPrice' },
        maxPrice: { $max: '$discountPrice' },
        avgQuantity: { $avg: '$quantity' },
        minQuantity: { $min: '$quantity' },
        maxQuantity: { $max: '$quantity' },
      },
    },
    {
      $sort: {
        avgQuantity: -1,
      },
    },
  ]);

  res.status(200).json({
    dailySales,
    sales,
    productStats,
  });
});
