import User from './userModel';

const mongoose = require('mongoose');

const salesSchema = mongoose.Schema(
  {
    products: {
      type: Array,
      require: true,
    },
    dateTime: {
      type: Date,
      default: Date.now,
      require: true,
    },
    subTotal: {
      type: Number,
      require: true,
    },
    totalTax: {
      type: Number,
      require: true,
    },
    grandTotal: {
      type: Number,
      require: true,
    },
    paidAmount: {
      type: Number,
      require: true,
    },
    paymentMethod: {
      type: String,
      default: ['Cash'],
      require: true,
      enum: ['Cash', 'MobileMoney', 'Gift'],
    },
    balance: {
      type: String,
      require: true,
    },
    quantitySold: {
      type: Number,
      require: true,
    },
    saler: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
    },
  },
  { timestamps: true },
);

export default mongoose.models && mongoose.models.Sales
  ? mongoose.models.Sales
  : mongoose.model('Sales', salesSchema);
