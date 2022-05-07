import nc from 'next-connect';
import dbConnect from '../../../../backend/config/dbConnect';
import { getSalesChartInfo } from '../../../../backend/controllers/salesController';
import { isAdmin } from '../../../../backend/middlewares';
import { isAuthenticatedUser } from '../../../../backend/middlewares/auth';

import onError from '../../../../backend/utils/errors';
const handler = nc({ onError });

dbConnect();

// handler.get(getAllReviews);
handler.get(getSalesChartInfo);

export default handler;
