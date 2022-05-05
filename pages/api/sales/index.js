import nc from 'next-connect';
import dbConnect from '../../../backend/config/dbConnect';
import {
  createSales,
  getSalesByUser,
} from '../../../backend/controllers/salesController';
import { isAuthenticatedUser } from '../../../backend/middlewares/auth';

import onError from '../../../backend/utils/errors';
const handler = nc({ onError });

dbConnect();

// handler.get(getAllReviews);
handler.use(isAuthenticatedUser).post(createSales);
handler.use(isAuthenticatedUser).get(getSalesByUser);

export default handler;
