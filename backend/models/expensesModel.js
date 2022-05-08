import mongoose from 'mongoose';
const { Schema } = mongoose;

const expensesSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'Name is required'],
    },

    amount: {
      type: Number,
      trim: true,
      required: [true, 'Amount is required'],
    },

    date: {
      type: Date,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      unique: true,
      index: true,
    },
  },
  { timestamps: true },
);

export default mongoose.models && mongoose.models.Expenses
  ? mongoose.models.Expenses
  : mongoose.model('Expenses', expensesSchema);
