import mongoose from 'mongoose';
const { Schema } = mongoose;

const reviewSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      max: 32,
    },

    message: {
      type: {},
      minlength: 200,
    },

    image: {},

    slug: {
      type: String,
      unique: true,
      index: true,
    },
  },
  { timestamps: true },
);

module.exports =
  mongoose.models.Review || mongoose.model('Review', reviewSchema);
