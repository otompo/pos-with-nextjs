import mongoose from 'mongoose';
const { Schema } = mongoose;

const priceSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: true,
      max: 32,
    },
    salary: {
      type: String,
      trim: true,
    },

    qty: {
      type: Number,
      minlength: 200,
      trim: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.models.Price || mongoose.model('Price', priceSchema);
