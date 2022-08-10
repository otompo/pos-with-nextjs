import Sales from '../models/salesModel';
import catchAsync from '../utils/catchAsync';
// GET total cost for the selected day

export const getTotalCostAmount = catchAsync(async (req, res, next) => {
  const { costStartDate, costEndDate } = req.query;

  var startDate = new Date(costStartDate);
  startDate.setHours(0, 0, 0, 0);

  var endDate = new Date(costEndDate);
  endDate.setHours(23, 59, 59, 999);

  const costData = await Sales.aggregate([
    {
      $unwind: '$products',
    },
    {
      $match: {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$products.costPrice' },
      },
    },
  ]);
  res.send(costData[0]);
});
