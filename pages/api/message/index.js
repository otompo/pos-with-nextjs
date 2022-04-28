import nc from 'next-connect';
import dbConnect from '../../../backend/config/dbConnect';
import { createMessage } from '../../../backend/controllers/messageController';
import onError from '../../../backend/utils/errors';
const handler = nc({ onError });

dbConnect();

handler.post(createMessage);

export default handler;
