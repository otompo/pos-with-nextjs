import Sales from '../models/salesModel';
import Product from '../models/productModel';
import Report from '../models/reportsModel';
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
        // avgPrice: { $avg: '$grandTotal' },
        // minPrice: { $min: '$grandTotal' },
        // maxPrice: { $max: '$grandTotal' },
        quantitySold: { $sum: '$quantitySold' },
      },
    },
    { $sort: { _id: 1 } },
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
        totalSelles: { $sum: '$sellingPrice' },
        totalcost: { $sum: '$costPrice' },
        totalQuantity: { $sum: '$quantity' },
        avgPrice: { $avg: '$sellingPrice' },
        minPrice: { $min: '$sellingPrice' },
        maxPrice: { $max: '$sellingPrice' },
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

  const reports = await Report.aggregate([
    {
      $project: {
        _id: 1,
        yearSalesDate: { $year: '$salesStartDate' },
        monthSalesDate: { $month: '$salesStartDate' },
        totalCost: 1,
        totalSales: 1,
        totalExpenses: 1,
        subProfit: 1,
        profit: 1,
      },
    },
    {
      $group: {
        _id: {
          yearSalesDate: '$yearSalesDate',
          monthSalesDate: '$monthSalesDate',
        },
        totalCost: { $sum: '$totalCost' },
        totalSales: { $sum: '$totalSales' },
        totalExpenses: { $sum: '$totalExpenses' },
        subProfit: { $sum: '$subProfit' },
        profit: { $sum: '$profit' },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.status(200).json({
    dailySales,
    sales,
    productStats,
    reports,
  });
});
