import Sales from '../models/salesModel';
import Product from '../models/productModel';
import Expenses from '../models/expensesModel';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';

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
