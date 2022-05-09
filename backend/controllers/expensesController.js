import Expenses from '../models/expensesModel';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import slugify from 'slugify';
import { nanoid } from 'nanoid';
// create contact Expenses
export const createExpenses = catchAsync(async (req, res) => {
  const { name, amount, expenseDate } = req.body;
  let slug = (slugify(name) + nanoid(5)).toLowerCase();
  // const alreadyExist = await Expenses.findOne({ slug });
  // if (alreadyExist) {
  //   return next(new AppError('Expense name already exist', 400));
  // }
  const expenses = await Expenses({
    slug: slug,
    name: name,
    amount: amount,
    date: expenseDate,
  }).save();

  res.status(200).send(expenses);
});

// get all contact Expenses
export const getAllExpenses = catchAsync(async (req, res) => {
  const expenses = await Expenses.find({}).sort({ createdAt: -1 });
  res.status(200).send(expenses);
});

// get single contact Expenses
export const getSingleExpenses = catchAsync(async (req, res, next) => {
  const { slug } = req.query;
  const expenses = await Expenses.findOne({ slug });
  if (!expenses) {
    return next(new AppError('Expenses not found', 404));
  }
  res.status(200).send(expenses);
});

// update expeses
export const updateExpenses = catchAsync(async (req, res, next) => {
  const { name, amount, expenseDate } = req.body;
  // let slug = (slugify(name) + nanoid(5)).toLowerCase();
  const { slug } = req.query;
  const expesesData = await Expenses.findOne({ slug });
  const updatedExpenses = await Expenses.findOneAndUpdate(
    { slug: expesesData.slug },
    {
      // slug: (slugify(name)).toLowerCase(),
      name: name,
      amount: amount,
      date: expenseDate,
      ...req.body,
    },
    {
      new: true,
    },
  );
  res.send(updatedExpenses);
});

// delete Expenses
export const deleteExpenses = catchAsync(async (req, res, next) => {
  const expense = await Expenses.findById(req.query.id);
  const data = await Expenses.findByIdAndRemove(expense._id);
  if (!data) {
    return next(new AppError('Expense not found', 404));
  }
  res.status(200).send({ status: 'Success' });
});

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
      { date: { $gte: startDate.toJSON(), $lte: endDate.toJSON() } },
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
