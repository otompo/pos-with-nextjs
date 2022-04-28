import nc from 'next-connect';
import dbConnect from '../../../../backend/config/dbConnect';
import {
  createProduct,
  getAllProducts,
} from '../../../../backend/controllers/productController';
import { isAdmin } from '../../../../backend/middlewares';
import { isAuthenticatedUser } from '../../../../backend/middlewares/auth';
import onError from '../../../../backend/utils/errors';
const handler = nc({ onError });

dbConnect();

handler.use(isAuthenticatedUser, isAdmin).post(createProduct);

handler.use(isAuthenticatedUser, isAdmin).get(getAllProducts);

export default handler;
