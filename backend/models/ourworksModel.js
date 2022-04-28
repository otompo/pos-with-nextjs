const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema;

const ourworksSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      min: 3,
      max: 160,
      required: true,
      unique: true,
    },

    category: [{ type: ObjectId, ref: 'Category', required: true }],

    description: {
      type: {},
      minlength: 100,
    },

    slug: {
      type: String,
      unique: true,
      index: true,
    },

    video: {},
  },
  { timestamps: true },
);

module.exports =
  mongoose.models.Ourworks || mongoose.model('Ourworks', ourworksSchema);
