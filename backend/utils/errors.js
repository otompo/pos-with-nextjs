import AppError from '../utils/appError';

export default (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  let error = { ...err };
  error.message = err.message;
  // Wrong Mongoose Object ID Error
  if (err.name === 'CastError') {
    const message = `Resource not found, Invalid:${err.path}`;
    error = new AppError(message, 404);
  }

  // Handling mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((value) => value.message);
    error = new AppError(message, 400);
  }

  // JsonWeb Token Error
  // if (err.name === 'JsonWebTokenError') {
  //   const message = `Invalid token. Please login first`;
  //   error = new AppError(message, 401);
  // }

  // // Token Expired Error
  // if (err.name === 'TokenExpiredError') {
  //   const message = `Invalid token, your token has expired login again`;
  //   error = new AppError(message, 401);
  // }

  // Duplicate field error
  // if (err.code === 11000) {
  //   const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  //   const message = `The value ${value}. has been taken please use another value!`;
  //   // const message = `Please the email has been taken!`;
  //   error = new AppError(message, 400);
  // }

  res.status(err.statusCode).json({
    success: false,
    error,
    message: error.message,
    stack: error.stack,
  });
};
