import nc from 'next-connect';
import dbConnect from '../../../../backend/config/dbConnect';
import { updatePassword } from '../../../../backend/controllers/userController';
import onError from '../../../../backend/utils/errors';
import { isAuthenticatedUser } from '../../../../backend/middlewares/auth';

const handler = nc({ onError });

dbConnect();

handler.use(isAuthenticatedUser).patch(updatePassword);
export const config = { api: { bodyParser: { sizeLimit: '25mb' } } };
export default handler;
