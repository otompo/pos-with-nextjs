import nc from 'next-connect';
import dbConnect from '../../../backend/config/dbConnect';
import onError from '../../../backend/utils/errors';
import { isAuthenticatedUser } from '../../../backend/middlewares/auth';
import { currentUserProfile } from '../../../backend/controllers/authController';

const handler = nc({ onError });
dbConnect();
handler.use(isAuthenticatedUser).get(currentUserProfile);

export default handler;
