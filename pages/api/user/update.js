import nc from 'next-connect';
import dbConnect from '../../../backend/config/dbConnect';
import onError from '../../../backend/utils/errors';
import { isAuthenticatedUser } from '../../../backend/middlewares/auth';
import { updateUserProfile } from '../../../backend/controllers/userController';

const handler = nc({ onError });
dbConnect();
handler.use(isAuthenticatedUser).put(updateUserProfile);

export default handler;
