import mongoose from 'mongoose';
const { Schema } = mongoose;

const settingsSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      max: 32,
    },

    address: {
      type: String,
      trim: true,
      max: 32,
    },

    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      max: 32,
    },
    contactNumber: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      max: 32,
    },
    website: {
      type: String,
      trim: true,
      max: 32,
    },
    logoDefualt: {
      type: String,
      default: '/img/preview.ico',
    },
    logo: { type: String },
    description: {
      type: {},
      trim: true,
      max: 2000000,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
  },
  { timestamps: true },
);

export default mongoose.models && mongoose.models.Settings
  ? mongoose.models.Settings
  : mongoose.model('Settings', settingsSchema);
