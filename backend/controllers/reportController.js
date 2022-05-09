import Report from '../models/reportsModel';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';

export const createReport = catchAsync(async (req, res, next) => {
  const {
    salesStartDate,
    salesEndDate,
    expensesStartDate,
    expensesEndDate,
    totalSales,
    totalExpenses,
    profit,
  } = req.body;
  if (
    !salesStartDate ||
    !salesEndDate ||
    !expensesStartDate ||
    !expensesEndDate ||
    !totalSales ||
    !totalExpenses ||
    !profit
  ) {
    return next(new AppError('No data selected', 500));
  }
  const data = await new Report({
    salesStartDate,
    salesEndDate,
    expensesStartDate,
    expensesEndDate,
    totalSales,
    totalExpenses,
    profit,
  }).save();
  res.send(data);
});

export const getAllReports = catchAsync(async (req, res, next) => {
  const data = await Report.find().sort({ createdAt: -1 });
  res.send(data);
});
