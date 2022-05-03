import mongoose from 'mongoose';
const { Schema } = mongoose;

const categorySchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      max: 32,
    },

    // description: {
    //   type: {},
    //   minlength: 100,
    // },

    slug: {
      type: String,
      unique: true,
      index: true,
    },
  },
  { timestamps: true },
);

export default mongoose.models && mongoose.models.Category
  ? mongoose.models.Category
  : mongoose.model('Category', categorySchema);
