import Category from './categoryModel';
import User from './userModel';

const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;
const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      trim: true,
    },
    discount: {
      type: Number,
      trim: true,
      default: 0,
    },
    discountPrice: {
      type: Number,
      trim: true,
      default: 0,
    },
    tax: {
      type: Number,
      trim: true,
      default: 0,
    },
    batchId: {
      type: String,
      require: true,
      trim: true,
    },
    expireDate: {
      type: Date,
      required: true,
      trim: true,
    },
    price: {
      type: String,
      required: true,
      trim: true,
    },
    imageDefualt: {
      type: String,
      default: '/img/preview.ico',
    },

    imagePath: { type: String, require: true },

    category: [{ type: mongoose.Schema.Types.ObjectId, ref: Category }],

    user: { type: mongoose.Schema.Types.ObjectId, ref: User },

    slug: {
      type: String,
      unique: true,
      index: true,
    },
  },

  { timestamps: true },
);

export default mongoose.models && mongoose.models.Product
  ? mongoose.models.Product
  : mongoose.model('Product', productSchema);
