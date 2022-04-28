import User from '../models/userModel';
import jwt from 'jsonwebtoken';
import { comparePassword, hashPassword } from '../utils/authHelpers';
import AWS from 'aws-sdk';
import { nanoid } from 'nanoid';
import shortId from 'shortid';

import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';

const awsConfig = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  apiVersion: process.env.AWS_API_VERSION,
};
const SES = new AWS.SES(awsConfig);

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

export const sendTestEmail = async (req, res) => {
  const params = {
    Source: process.env.EMAIL_FROM,
    Destination: {
      ToAddresses: ['tophealthtv@gmail.com'],
    },

    ReplyToAddresses: [process.env.EMAIL_FROM],

    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: `<html>
                <h1>Reset password link</h1>
                <p>
                please use the following link to reset your password
                </p> 
            </html>
          `,
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'Password Resest Link',
      },
    },
  };

  const emailSent = SES.sendEmail(params).promise();
  emailSent
    .then((data) => {
      // console.log(data);
      res.json({ ok: true });
    })
    .catch((err) => {
      console.log(err);
    });
};

// forget password
export const forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  // console.log(email);
  const shortCode = nanoid(6).toUpperCase();
  const user = await User.findOneAndUpdate(
    { email },
    { passwordResetCode: shortCode },
    { new: true },
  );

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  // prepare for email
  const params = {
    Source: process.env.EMAIL_FROM,
    Destination: {
      ToAddresses: [email],
    },

    ReplyToAddresses: [process.env.EMAIL_FROM],

    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: `<html>
              <h1>Reset Password Link</h1>
              <p>
                Please use the following code to reset your password
              </p>
              <h2 style="color:red; font-size:18px">${shortCode}</h2>
              <i style="font-size:16px">codesmartwebsoft.com</i>
            </html>
          `,
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'Password Resest Link',
      },
    },
  };
  const emailSent = SES.sendEmail(params).promise();
  emailSent
    .then((data) => {
      // console.log(data);
      res.json({ ok: true });
    })
    .catch((err) => {
      console.log(err);
    });
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
