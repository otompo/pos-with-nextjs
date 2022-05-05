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
    cart,
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
  const sales = await Sales.find({ saler: req.user._id }).sort({
    createdAt: -1,
  });
  res.send({
    total: sales.length,
    sales,
  });
});
