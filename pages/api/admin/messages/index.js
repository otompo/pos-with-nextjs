import nc from 'next-connect';
import { getAllMessages } from '../../../../backend/controllers/messageController';
import dbConnect from '../../../../backend/config/dbConnect';
import { isAdmin } from '../../../../backend/middlewares';
import onError from '../../../../backend/utils/errors';
import { isAuthenticatedUser } from '../../../../backend/middlewares/auth';
const handler = nc({ onError });

dbConnect();

handler.use(isAuthenticatedUser, isAdmin).get(getAllMessages);

export default handler;
