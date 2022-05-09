import nc from 'next-connect';
import dbConnect from '../../../../backend/config/dbConnect';
import { getMonthlyPlan } from '../../../../backend/controllers/statisticsController';
import { isAdmin } from '../../../../backend/middlewares';
import { isAuthenticatedUser } from '../../../../backend/middlewares/auth';

import onError from '../../../../backend/utils/errors';
const handler = nc({ onError });

dbConnect();

// handler.get(getAllReviews);
handler.get(getMonthlyPlan);

export default handler;
