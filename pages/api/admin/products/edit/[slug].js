import nc from 'next-connect';
import dbConnect from '../../../../../backend/config/dbConnect';
import {
  getSingleProduct,
  updateProduct,
} from '../../../../../backend/controllers/productController';

import { isAdmin } from '../../../../../backend/middlewares';
import { isAuthenticatedUser } from '../../../../../backend/middlewares/auth';
import onError from '../../../../../backend/utils/errors';
const handler = nc({ onError });

dbConnect();

handler.put(updateProduct);
handler.use(isAuthenticatedUser, isAdmin).get(getSingleProduct);

export default handler;
