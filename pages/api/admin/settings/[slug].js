import nc from 'next-connect';
import { getAllDetails } from '../../../../backend/controllers/settingsController';
import dbConnect from '../../../../backend/config/dbConnect';
import onError from '../../../../backend/utils/errors';
import { isAuthenticatedUser } from '../../../../backend/middlewares/auth';

const handler = nc({ onError });

dbConnect();

handler.use(isAuthenticatedUser).get(getAllDetails);

export default handler;
