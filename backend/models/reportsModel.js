import mongoose from 'mongoose';
const { Schema } = mongoose;

const reportsSchema = new Schema(
  {
    totalSales: {
      type: Number,
      trim: true,
      required: [true, 'totalSales is required'],
    },
    totalExpenses: {
      type: Number,
      trim: true,
      required: [true, 'totalExpenses is required'],
    },
    profit: {
      type: Number,
      trim: true,
      required: [true, 'profit is required'],
    },

    salesStartDate: {
      type: Date,
      required: true,
      trim: true,
    },
    salesEndDate: {
      type: Date,
      required: true,
      trim: true,
    },
    expensesStartDate: {
      type: Date,
      required: true,
      trim: true,
    },
    expensesEndDate: {
      type: Date,
      required: true,
      trim: true,
    },
  },
  { timestamps: true },
);

export default mongoose.models && mongoose.models.Report
  ? mongoose.models.Report
  : mongoose.model('Report', reportsSchema);
