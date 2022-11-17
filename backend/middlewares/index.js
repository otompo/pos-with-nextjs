import User from '../models/userModel';
import AppError from '../utils/appError';
import catchAsync from '../utils/catchAsync';

export const isAdmin = (req, res, next) => {
  // console.log(req.user);
  User.findById({ _id: req.user._id }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: 'user not found....',
      });
    }

    if (!req.user.role.includes('admin')) {
      return next(new AppError('Admin resource. Access denied', 403));
    }
    next();
  });
};

// Admin Middleware
export const adminMiddleware = async (req, res, next) => {
  const user = await User.findById(req.user._id).exec();
  if (!user.role.includes('admin')) {
    return res.status(400).json({
      error: 'Admin resource. Access denied',
    });
  }
  next();
};

// AuthUserMiddleware
export const authMiddleware = async (req, res, next) => {
  try {
    const username = req.params.username;
    let user = await User.findOne({ username }).exec();
    if (!user) return res.status(400).send('User not found');
    // req.profile = user;
    next();
  } catch (error) {
    console.log(error);
    return res.status(200).send(error.message);
  }
};
