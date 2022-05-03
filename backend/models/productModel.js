import categoryModel from './categoryModel';

const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;
const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
      trim: true,
    },
    quantity: {
      type: Number,
      require: true,
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
      require: true,
      trim: true,
    },
    price: {
      type: String,
      require: true,
      trim: true,
    },
    imageDefualt: {
      type: String,
      default: '/img/preview.ico',
    },

    imagePath: { type: String, require: true },

    category: [{ type: mongoose.Schema.Types.ObjectId, ref: categoryModel }],

    user: { type: ObjectId, ref: 'User', required: true },

    slug: {
      type: String,
      unique: true,
      index: true,
    },
  },

  { timestamps: true },
);

// module.exports =
// mongoose.models.Product || mongoose.model('Product', productSchema);
export default mongoose.models && mongoose.models.Product
  ? mongoose.models.Product
  : mongoose.model('Product', productSchema);
