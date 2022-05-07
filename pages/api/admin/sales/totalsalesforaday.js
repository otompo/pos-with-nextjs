import nc from 'next-connect';
import dbConnect from '../../../../backend/config/dbConnect';
import { totalSalesForSelectedDay } from '../../../../backend/controllers/salesController';
import { isAdmin } from '../../../../backend/middlewares';
import { isAuthenticatedUser } from '../../../../backend/middlewares/auth';

import onError from '../../../../backend/utils/errors';
const handler = nc({ onError });

dbConnect();

// handler.get(getAllReviews);
handler.use(isAuthenticatedUser, isAdmin).get(totalSalesForSelectedDay);

export default handler;
