import Report from '../models/reportsModel';
import Expenses from '../models/expensesModel';
import catchAsync from '../utils/catchAsync';

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
