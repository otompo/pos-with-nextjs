import nc from 'next-connect';
import dbConnect from '../../../backend/config/dbConnect';
import {
  createReview,
  getAllReviews,
} from '../../../backend/controllers/reviewController';
import { isAuthenticatedUser } from '../../../backend/middlewares/auth';

import onError from '../../../backend/utils/errors';
const handler = nc({ onError });

dbConnect();

handler.get(getAllReviews);
handler.use(isAuthenticatedUser).post(createReview);

export const config = {
  api: { bodyParser: { sizeLimit: '25mb' } },
};
export default handler;
