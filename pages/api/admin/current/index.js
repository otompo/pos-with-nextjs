import nc from 'next-connect';
import { currentAdmin } from '../../../../backend/controllers/adminController';
import dbConnect from '../../../../backend/config/dbConnect';
import onError from '../../../../backend/utils/errors';
import { isAuthenticatedUser } from '../../../../backend/middlewares/auth';
const handler = nc({ onError });

dbConnect();

handler.use(isAuthenticatedUser).get(currentAdmin);

export default handler;
