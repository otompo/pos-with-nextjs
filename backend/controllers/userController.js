import User from '../models/userModel';
import { nanoid } from 'nanoid';
import AppError from '../utils/appError';
import catchAsync from '../utils/catchAsync';

export const updateUserProfile = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  // console.log(req.body.profileImage);
  const userUpdated = await User.findByIdAndUpdate(
    user._id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    { new: true },
  );
  res.status(200).json(userUpdated);
});

// make user an admin
export const makeUserAdmin = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.query.id);
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  const roleUpdated = await User.findByIdAndUpdate(
    user._id,
    {
      $addToSet: { role: 'Admin' },
    },
    { new: true },
  );
  res.send({ ok: true });
  // console.log(roleUpdated);
});

// remove user as an admin
export const removeUserAsAdmin = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.query.id);
  if (!user) {
    return next(new AppError('User not found', 404));
  }
  const roleUpdated = await User.findByIdAndUpdate(
    user._id,
    {
      $pull: { role: 'Admin' },
    },
    { new: true },
  );
  res.send({ ok: true });
  // console.log(roleUpdated);
});

// make user a saff by an admin
export const makeUserStaff = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password update. Please use/ updateMyPassword',
        400,
      ),
    );
  }

  const id = req.params.id;
  const user = await User.findByIdAndUpdate(
    id,
    {
      $addToSet: { role: 'Staff' },
    },
    { new: true },
  ).exec();
  if (!user) {
    return next(new AppError('User not found', 400));
  }
  res.status(200).json({
    status: 'Success',
    message: `${user.name} is now a staff`,
  });
});

// get users
export const getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find({}).select('-password').sort({ createdAt: -1 });
  res.send(users);
});

// delete user
export const removeUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.query.id);
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  const data = await User.findByIdAndRemove(user._id);
  res.json({ message: 'User Deleted' });
});

// get single user data
export const readSingleUser = catchAsync(async (req, res, next) => {
  let username = req.query.username;
  const user = await User.findOne({ username }).select('-password');
  if (!user) {
    return next(new AppError('User not found', 404));
  }
  res.send(user);
});

export const updatePassword = catchAsync(async (req, res, next) => {
  // Get the user from the database
  const user = await User.findById(req.user._id).select('+password');

  // Check id the Posted current password is correct

  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('your current password is wrong', 401));
  }

  // If password is correct update password
  user.password = req.body.password;
  user.generatedPasword = '';
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  //Log user in, send password

  // createSendToken(user, 200, res);
  // const token = signToken(user._id);
  res.status(200).json({
    success: true,
    message: 'Password updated successfully',
  });
});
