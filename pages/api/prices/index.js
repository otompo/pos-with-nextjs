import nc from 'next-connect';
import dbConnect from '../../../backend/config/dbConnect';
import {
  createPrice,
  getAllPrices,
} from '../../../backend/controllers/priceController';
import { isAuthenticatedUser } from '../../../backend/middlewares/auth';

import onError from '../../../backend/utils/errors';
const handler = nc({ onError });

dbConnect();

handler.get(getAllPrices);
handler.use(isAuthenticatedUser).post(createPrice);

export const config = {
  api: { bodyParser: { sizeLimit: '25mb' } },
};
export default handler;
