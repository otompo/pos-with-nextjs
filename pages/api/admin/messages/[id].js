import nc from 'next-connect';
import {
  deleteMessage,
  getSingleMessage,
  replyMessage,
} from '../../../../backend/controllers/messageController';
import dbConnect from '../../../../backend/config/dbConnect';
import { isAdmin } from '../../../../backend/middlewares';
import onError from '../../../../backend/utils/errors';
import { isAuthenticatedUser } from '../../../../backend/middlewares/auth';
const handler = nc({ onError });

dbConnect();

handler.use(isAuthenticatedUser, isAdmin).get(getSingleMessage);
handler.use(isAuthenticatedUser, isAdmin).delete(deleteMessage);
handler.use(isAuthenticatedUser, isAdmin).post(replyMessage);

export default handler;
