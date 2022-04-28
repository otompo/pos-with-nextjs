import mongoose from 'mongoose';
const { Schema } = mongoose;

const messageSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    email: {
      type: String,
      trim: true,
      required: [true, 'Email is required'],
    },
    subject: {
      type: String,
      trim: true,
      required: [true, 'Subject is required'],
    },
    message: {
      type: String,
      trim: true,
      required: [true, 'Message is required'],
    },
    replyedMessage: {
      type: {},
      trim: true,
      max: 2000000,
    },
    replyed: {
      type: Boolean,
      default: false,
    },

    replyedDate: {
      type: Date,
    },
  },
  { timestamps: true },
);

module.exports =
  mongoose.models.Message || mongoose.model('Message', messageSchema);
