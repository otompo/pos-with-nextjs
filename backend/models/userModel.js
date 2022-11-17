import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      required: true,
      max: 32,
      unique: true,
      index: true,
      lowercase: true,
    },

    name: {
      trim: true,
      type: String,
      required: [true, 'Please enter your name'],
      maxLength: [50, 'Your name cannot exceed 50 characters'],
    },

    email: {
      type: String,
      unique: true,
      required: [true, 'Please enter your email'],
      validate: [validator.isEmail, 'Please enter valid email address'],
    },

    password: {
      type: String,
      trim: true,
      required: [true, 'Please enter your password'],
      minlength: [6, 'Your password must be longer than 6 characters'],
      select: false,
    },

    role: {
      type: [String],
      default: ['staff'],
      enum: ['staff', 'admin'],
    },
    generatedPasword: {
      type: String,
    },
    last_login_date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

userSchema.pre('save', async function (next) {
  // Only run this function if password is modified
  if (!this.isModified('password')) return next();
  // Hash the password field
  this.password = await bcrypt.hash(this.password, 12);
  // Delete the password confirm field
  // this.passwordConfirm = undefined;
  next();
});

// creating an instance methods
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

export default mongoose.models.User || mongoose.model('User', userSchema);
