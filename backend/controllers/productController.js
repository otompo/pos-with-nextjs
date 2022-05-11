import Product from '../models/productModel';
import Price from '../models/priceModel';
import catchAsync from '../utils/catchAsync';
import slugify from 'slugify';
import AppError from '../utils/appError';
const { Parser } = require('json2csv');
const csvtojson = require('csvtojson');
import { nanoid } from 'nanoid';
const nodemailer = require('nodemailer');

export const createProduct = catchAsync(async (req, res, next) => {
  const {
    name,
    quantity,
    batchId,
    expireDate,
    price,
    image,
    selectedCategory,
    discount,
    tax,
  } = req.body;
  // calculate price discount
  let resetPriceDiscount = price - (price * discount) / 100;
  //   let slug = slugify(name).toLowerCase() + `-${nanoid(10)}`;
  let slug = slugify(name).toLowerCase();
  const alreadyExist = await Product.findOne({ slug });
  if (alreadyExist) {
    return next(new AppError('Product name already exist', 400));
  }
  const products = await new Product({
    name: name,
    quantity: quantity,
    batchId: batchId,
    expireDate: expireDate,
    price: price,
    imagePath: image,
    category: selectedCategory,
    slug: slug,
    discount: discount,
    tax: tax,
    discountPrice: resetPriceDiscount,
    user: req.user._id,
  }).save();
  res.send(products);
});

// get all works
export const getAllProducts = catchAsync(async (req, res) => {
  const products = await Product.find({})
    .sort({ createdAt: -1 })
    .populate('category', '_id name slug')
    .populate('user', '_id name');
  res.status(200).send({
    total: products.length,
    products,
  });
});

export const getSingleProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findOne({ slug: req.query.slug }).populate(
    'category',
    '_id name slug',
  );
  res.send(product);
});

// products instock
export const getProductsInstock = catchAsync(async (req, res, next) => {
  const products = await Product.find({
    $expr: { $gt: [{ $toDouble: '$quantity' }, 30] },
  })
    .populate('category', '_id name slug')
    .populate('user', '_id name');

  res.send({
    total: products.length,
    products,
  });
});

// products out of stock
export const getProductsOutOfStock = catchAsync(async (req, res, next) => {
  const products = await Product.find({
    $expr: { $lte: [{ $toDouble: '$quantity' }, 30] },
  })
    .populate('category', '_id name slug')
    .populate('user', '_id name');
  res.send({ total: products.length, products });
});
// abouttooutofstock
export const getProductAboutToOutofStock = catchAsync(
  async (req, res, next) => {
    const products = await Product.find({
      $and: [
        { $expr: { $lte: [{ $toDouble: '$quantity' }, 50] } },
        { $expr: { $gte: [{ $toDouble: '$quantity' }, 30] } },
      ],
    })
      .populate('category', '_id name slug')
      .populate('user', '_id name');
    res.send({ total: products.length, products });
  },
);

// getExpired
export const getExpiredProduct = catchAsync(async (req, res, next) => {
  const products = await Product.find({ expireDate: { $lte: new Date() } })
    .populate('category', '_id name slug')
    .populate('user', '_id name');
  res.send({ total: products.length, products });
});

// getAboutToExpire
export const getProductsAboutToExpire = catchAsync(async (req, res, next) => {
  var date = new Date();
  var date10 = new Date(date.getTime());
  date10.setDate(date10.getDate() + 10);

  const products = await Product.find({
    expireDate: { $lte: new Date(date10), $gte: new Date() },
  })
    .populate('category', '_id name slug')
    .populate('user', '_id name');
  res.send({ total: products.length, products });
});

// updateQuantity
export const updateProductQuantity = catchAsync(async (req, res, next) => {
  let { quantity, currentQty } = req.body;
  const { slug } = req.query;
  const product = await Product.findOne({ slug });
  if (!product) {
    return next(new AppError('Product not found', 404));
  }
  let newQuantity = Number(quantity) + Number(currentQty);

  const updatedProduct = await Product.findOneAndUpdate(
    { slug },
    {
      // ...req.body,
      quantity: newQuantity,
    },
    {
      new: true,
    },
  );

  res.json(updatedProduct);
});

// update product
export const updateProduct = catchAsync(async (req, res, next) => {
  const { name, selectedCategory, price, quantity, batchId, tax, discount } =
    req.body;

  const { slug } = req.query;
  const product = await Product.findOne({ slug });
  // var slugname = slugify(name).toLowerCase();

  const update = await Product.findOneAndUpdate(
    { slug: product.slug },
    {
      slug: slugify(name).toLowerCase(),
      name: name,
      category: selectedCategory,
      price: price,
      quantity: quantity,
      batchId: batchId,
      tax: tax,
      discount: discount,
      ...req.body,
    },
    {
      new: true,
    },
  );
  res.send(update);
});

// delete product
export const removeProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.query.id);

  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  const data = await Product.findByIdAndRemove(product._id);

  res.json({ message: 'Product Deleted' });
});

export const exportProductData = catchAsync(async (req, res, next) => {
  const fields = [
    'batchId',
    'name',
    'quantity',
    'expireDate',
    'price',
    'discount',
    'discountPrice',
    'tax',
  ];
  const opts = { fields };

  const product = await Product.find({});
  const parser = new Parser(opts);
  const csv = parser.parse(product);
  res.status(200).send(Buffer.from(csv));
});

export const importProductData = catchAsync(async (req, res, next) => {
  csvtojson()
    .fromFile('./public/sample.csv')
    .then((csvData) => {
      // console.log(csvData);
      const data = Price.insertMany(csvData);
      res.send(csvData);
    });
});

// router.post('/sendmail', (req, res) => {
//   console.log('request came');
//   let user = req.body;
//   sendMail(user, (info) => {
//     console.log(`The mail has been send 😃 and the id is ${info.messageId}`);
//     res.send(info);
//   });
// });

// router.post('/sendmailOutOfStock', (req, res) => {
//   console.log('request came');
//   let user = req.body;
//   sendmailOutOfStock(user, (info) => {
//     console.log(`The mail has been send 😃 and the id is ${info.messageId}`);
//     res.send(info);
//   });
// });

// async function sendmailOutOfStock(user, callback) {
//   // reusable transporter object using the default SMTP transport
//   let transporter = nodemailer.createTransport({
//     host: 'smtp.gmail.com',
//     port: 587,
//     secure: false, // true for 465, false for other ports
//     auth: {
//       user: 'pharmacare.contactus@gmail.com',
//       pass: 'lalana1011294',
//     },
//   });

// async function sendMail(user, callback) {
//   // reusable transporter object using the default SMTP transport
//   let transporter = nodemailer.createTransport({
//     host: 'smtp.gmail.com',
//     port: 587,
//     secure: false, // true for 465, false for other ports
//     auth: {
//       user: 'pharmacare.contactus@gmail.com',
//       pass: 'lalana1011294',
//     },
//   });

//   let mailOptions = {
//     from: '"Pharma Care Pharmacies"<example.gmail.com>', // sender address
//     to: user.email, // list of receivers
//     subject: 'Requesting New Drug Oder ' + user.name, // Subject line
//     html: `
//     <head>
//     <style>
//       table {
//         font-family: arial, sans-serif;
//         border-collapse: collapse;
//         width: 100%;
//       }

//       td, th {
//         border: 1px solid #dddddd;
//         text-align: left;
//         padding: 8px;
//       }

//       tr:nth-child(even) {
//         background-color: #dddddd;
//       }
//       </style>
//       <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
//       <script>

//           $(function(){
//             var results = [], row;
//             $('#table1').find('th, td').each(function(){
//                 if(!this.previousElementSibling && typeof(this) != 'undefined'){ //New Row?
//                     row = [];
//                     results.push(row);
//                 }
//                 row.push(this.textContent || this.innerText); //Add the values (textContent is standard while innerText is not)
//             });
//             console.log(results);
//         });

//       </script>
//       </head>

//     <body>
//     <h1>Dear Supplier </h1><br>
//     <h3>Our current stock of ${user.name} has been expired</h3><br>
//     <h2>So we (PharmaCare Managment would like to request ${user.quantityNumber} amount of units from ${user.name} )</h2><br>
//     <h3>Please reply back if the this oder is verified.</h3>

//     <h2>Purchase Oder </h2>

//     <table id="table1">
//       <tr>
//         <th>Odered Drug Name</th>
//         <th>Drug Quantity </th>
//         <th>Requested Price per unit (Rs.)</th>
//       </tr>
//       <tr>
//         <td>${user.name}</td>
//         <td>${user.quantityNumber}</td>
//         <td>${user.price}</td>
//       </tr>

//     </table><br>

//     <h3>Info* : </h3>
//     <h4>If there is any issue reagrding the oder please be free to contact us or email us (pharmacare.contactus@gmail.com) 😃 </h4>
//     </body>
//     `,
//   };

//   // send mail with defined transport object
//   let info = await transporter.sendMail(mailOptions);

//   callback(info);
// }

//   let mailOptions = {
//     from: '"Pharma Care Pharmacies"<example.gmail.com>', // sender address
//     to: user.email, // list of receivers
//     subject: 'Requesting New Drug Oder ' + user.name, // Subject line
//     html: `
//     <head>
//     <style>
//       table {
//         font-family: arial, sans-serif;
//         border-collapse: collapse;
//         width: 100%;
//       }

//       td, th {
//         border: 1px solid #dddddd;
//         text-align: left;
//         padding: 8px;
//       }

//       tr:nth-child(even) {
//         background-color: #dddddd;
//       }
//       </style>
//       <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
//       <script>

//           $(function(){
//             var results = [], row;
//             $('#table1').find('th, td').each(function(){
//                 if(!this.previousElementSibling && typeof(this) != 'undefined'){ //New Row?
//                     row = [];
//                     results.push(row);
//                 }
//                 row.push(this.textContent || this.innerText); //Add the values (textContent is standard while innerText is not)
//             });
//             console.log(results);
//         });

//       </script>
//       </head>

//     <body>
//     <h1>Dear Supplier </h1><br>
//     <h3>Our current stock of ${user.name} has been finished/Out of stock</h3><br>
//     <h2>So we (PharmaCare Managment would like to request ${user.quantityNumber} amount of units from ${user.name} )</h2><br>
//     <h3>Please reply back if the this oder is verified.</h3>

//     <h2>Purchase Oder </h2>

//     <table id="table1">
//       <tr>
//         <th>Odered Drug Name</th>
//         <th>Drug Quantity </th>
//         <th>Requested Price per unit (Rs.)</th>
//       </tr>
//       <tr>
//         <td>${user.name}</td>
//         <td>${user.quantityNumber}</td>
//         <td>${user.price}</td>
//       </tr>

//     </table><br>

//     <h3>Info* : </h3>
//     <h4>If there is any issue reagrding the oder please be free to contact us or email us (pharmacare.contactus@gmail.com) 😃 </h4>
//     </body>
//     `,
//   };

//   // send mail with defined transport object
//   let info = await transporter.sendMail(mailOptions);

//   callback(info);
// }

// module.exports = router;
