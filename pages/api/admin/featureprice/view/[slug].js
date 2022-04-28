import nc from 'next-connect';
import dbConnect from '../../../../../backend/config/dbConnect';
import { readSingleFesturesPrice } from '../../../../../backend/controllers/featurePriceController';
import { isAdmin } from '../../../../../backend/middlewares';
import { isAuthenticatedUser } from '../../../../../backend/middlewares/auth';
import onError from '../../../../../backend/utils/errors';
const handler = nc({ onError });

dbConnect();

handler.use(isAuthenticatedUser, isAdmin).get(readSingleFesturesPrice);

export default handler;
