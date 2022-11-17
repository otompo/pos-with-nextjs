import User from '../models/userModel';
import jwt from 'jsonwebtoken';
import { comparePassword, hashPassword } from '../utils/authHelpers';
import { nanoid } from 'nanoid';
import shortId from 'shortid';

import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';

export const register = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;
  let username = shortId.generate();
  if (!password || password.length < 6) {
    return next(
      new AppError(
        'password is required and should be min 6 characters long',
        404,
      ),
    );
  }

  let userExist = await User.findOne({ email }).exec();
  if (userExist) return next(new AppError('Email is take', 404));

  // hash password
  const hashedPassword = await hashPassword(password);
  // register user
  const user = await new User({
    email,
    name,
    password: hashedPassword,
    username,
  }).save();

  res.send(user);
});

// Current user profile =>/api/profile
export const currentUserProfile = catchAsync(async (req, res) => {
  const user = await User.findById(req.user._id);
  // console.log(user);
  res.send(user);
});

export const resetPassword = catchAsync(async (req, res, next) => {
  const { email, code, newPassword } = req.body;
  // console.table({email, code, newPassword});
  const hashedPassword = await hashPassword(newPassword);
  const user = await User.findOneAndUpdate(
    {
      email,
      passwordResetCode: code,
    },
    {
      password: hashedPassword,
      passwordResetCode: '',
    },
  );
  if (!user) {
    return next(new AppError('User not found', 404));
  }
  return res.status(200).json({ ok: true });
});
