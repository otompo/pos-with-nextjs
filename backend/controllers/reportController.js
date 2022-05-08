import Sales from '../models/salesModel';
import Expenses from '../models/expensesModel';
import catchAsync from '../utils/catchAsync';

export const totalExpensesForSelectedDays = catchAsync(
  async (req, res, next) => {
    // if date is provided
    const { expensesStartDate, expensesEndDate } = req.query;
    // console.log(req.query);
    if (expensesStartDate && expensesEndDate) {
      startDate = new Date(expensesStartDate);
      startDate.setHours(0, 0, 0, 0);

      endDate = new Date(expensesEndDate);
      endDate.setHours(23, 59, 59, 999);
    } else {
      // beginning of current day
      var startDate = new Date();
      startDate.setHours(0, 0, 0, 0);

      // end of current day
      var endDate = new Date();
      endDate.setHours(23, 59, 59, 999);
    }

    Expenses.find(
      { dateTime: { $gte: startDate.toJSON(), $lte: endDate.toJSON() } },
      function (err, docs) {
        var result = {
          date: startDate,
        };

        if (docs) {
          var amount = docs.reduce(function (p, c) {
            return p + c.amount;
          }, 0.0);

          result.amount = parseFloat(parseFloat(amount).toFixed(2));

          res.send(result);
        } else {
          result.amount = 0;
          res.send(result);
        }
      },
    );
  },
);
