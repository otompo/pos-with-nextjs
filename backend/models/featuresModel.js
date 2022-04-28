import mongoose from 'mongoose';
const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema;
const featurepriceSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      max: 32,
    },
    category: [{ type: ObjectId, ref: 'Price', required: true }],

    features: [
      {
        name: '',
      },
    ],
    price: {
      type: String,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
  },
  { timestamps: true },
);

module.exports =
  mongoose.models.Featureprice ||
  mongoose.model('Featureprice', featurepriceSchema);
