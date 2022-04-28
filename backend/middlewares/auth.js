import AppError from '../utils/appError';
import { getSession } from 'next-auth/client';
import catchAsync from '../utils/catchAsync';

export const isAuthenticatedUser = catchAsync(async (req, res, next) => {
  const session = await getSession({ req });
  // console.log(session);
  if (!session) {
    return next(new AppError('Login first to access this resources', 401));
  }
  req.user = session.user;
  next();
});

// Handle user roles
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          `Role (${req.user.role})  is not allowed to access this resource.`,
          403,
        ),
      );
    }
    next();
  };
};
