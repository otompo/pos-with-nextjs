import Sales from '../models/salesModel';
import Product from '../models/productModel';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import slugify from 'slugify';
import { nanoid } from 'nanoid';

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
  let balanceTotal = Number(paidAmount) - Number(grandTotal);
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

// GET total sales for the current day
app.get('/day-total', function (req, res) {
  // if date is provided
  if (req.query.date) {
    startDate = new Date(req.query.date);
    startDate.setHours(0, 0, 0, 0);

    endDate = new Date(req.query.date);
    endDate.setHours(23, 59, 59, 999);
  } else {
    // beginning of current day
    var startDate = new Date();
    startDate.setHours(0, 0, 0, 0);

    // end of current day
    var endDate = new Date();
    endDate.setHours(23, 59, 59, 999);
  }

  Transactions.find(
    { date: { $gte: startDate.toJSON(), $lte: endDate.toJSON() } },
    function (err, docs) {
      var result = {
        date: startDate,
      };

      if (docs) {
        var total = docs.reduce(function (p, c) {
          return p + c.total;
        }, 0.0);

        result.total = parseFloat(parseFloat(total).toFixed(2));

        res.send(result);
      } else {
        result.total = 0;
        res.send(result);
      }
    },
  );
});

// GET transactions for a particular date
app.get('/by-date', function (req, res) {
  var startDate = new Date();
  startDate.setHours(0, 0, 0, 0);

  var endDate = new Date();
  endDate.setHours(23, 59, 59, 999);

  Transactions.find(
    { date: { $gte: startDate.toJSON(), $lte: endDate.toJSON() } },
    function (err, docs) {
      if (docs) res.send(docs);
    },
  );
});

// Add new transaction
app.post('/new', function (req, res) {
  var newTransaction = req.body;

  Transactions.insert(newTransaction, function (err, transaction) {
    if (err) res.status(500).send(err);
    else {
      res.sendStatus(200);
      Inventory.decrementInventory(transaction.products);
    }
  });
});

router.get('/getSalesChartInfo', (req, res, next) => {
  Sales.aggregate([
    {
      $project: {
        paidAmount: 1,
        month: { $month: '$dateTime' },
      },
    },
    {
      $group: {
        _id: '$month',
        total: { $sum: { $toDouble: '$paidAmount' } },
      },
    },
  ]).then((documents) => {
    res.status(200).json({
      message: 'sales chart details obtaine sucessfully',
      sales: documents,
    });
  });
});
