import nc from 'next-connect';
import dbConnect from '../../../../backend/config/dbConnect';
import { getSalesByUserLimit } from '../../../../backend/controllers/salesController';
import { isAuthenticatedUser } from '../../../../backend/middlewares/auth';

import onError from '../../../../backend/utils/errors';
const handler = nc({ onError });

dbConnect();

handler.use(isAuthenticatedUser).get(getSalesByUserLimit);

export default handler;
