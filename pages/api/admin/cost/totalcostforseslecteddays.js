import nc from 'next-connect';
import dbConnect from '../../../../backend/config/dbConnect';
import { getTotalCostAmount } from '../../../../backend/controllers/costController';
import { isAdmin } from '../../../../backend/middlewares';
import { isAuthenticatedUser } from '../../../../backend/middlewares/auth';

import onError from '../../../../backend/utils/errors';
const handler = nc({ onError });

dbConnect();

// handler.get(getAllReviews);
handler.use(isAuthenticatedUser, isAdmin).get(getTotalCostAmount);

export default handler;
