import nc from 'next-connect';
import dbConnect from '../../../../backend/config/dbConnect';
import { updateImage } from '../../../../backend/controllers/userController';
import onError from '../../../../backend/utils/errors';
import { isAuthenticatedUser } from '../../../../backend/middlewares/auth';
const handler = nc({ onError });

dbConnect();

handler.use(isAuthenticatedUser).put(updateImage);

export default handler;
