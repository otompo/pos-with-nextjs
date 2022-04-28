import Message from '../models/messagesModel';
import AWS from 'aws-sdk';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import { message } from 'antd';
const awsConfig = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  apiVersion: process.env.AWS_API_VERSION,
};

const SES = new AWS.SES(awsConfig);

// create contact message
export const createMessage = catchAsync(async (req, res) => {
  const { name, email, subject, message } = req.body;
  const contact = await Message({
    name: name,
    email: email,
    subject: subject,
    message: message,
  }).save();

  res.status(200).send(contact);
});

// get all contact messages
export const getAllMessages = catchAsync(async (req, res) => {
  const messages = await Message.find({}).sort({ createdAt: -1 });
  res.status(200).send(messages);
});

// get total contacts
export const getTotalMessages = catchAsync(async (req, res) => {
  const messages = await Message.find({ replyed: { $ne: true } });
  res.status(200).send({
    total: messages.length,
    contact: null,
  });
});

// get single contact message
export const getSingleMessage = catchAsync(async (req, res, next) => {
  const message = await Message.findById(req.query.id);
  if (!message) {
    return next(new AppError('Meesage not found', 404));
  }
  res.status(200).send(message);
});

// delete message
export const deleteMessage = catchAsync(async (req, res, next) => {
  const massage = await Message.findById(req.query.id);
  const data = await Message.findByIdAndRemove(massage._id);
  if (!data) {
    return next(new AppError('Meesage not found', 404));
  }
  res.status(200).send({ status: 'Success' });
});

// reply message
export const replyMessage = catchAsync(async (req, res, next) => {
  const { email, replyedMessage } = req.body;
  // console.log(email);
  if (!email || !replyedMessage) {
    return next(new AppError('Plese fields can not be empty', 400));
  }

  const message = await Message.findById(req.query.id);
  if (!message) {
    return next(new AppError('Message not found', 404));
  }

  const result = await Message.findByIdAndUpdate(
    message._id,
    { replyedMessage, replyed: true, replyedDate: new Date() },
    // { new: true },
  );

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
              <div>
              <p style="font-size:16px, text-align:justify">${replyedMessage}</p>
              </div>
              <br/>
              <i style="font-size:16px">codesmartwebsoft.com</i>
            </html>
          `,
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'Message',
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
