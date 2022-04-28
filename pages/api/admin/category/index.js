import nc from 'next-connect';
import dbConnect from '../../../../backend/config/dbConnect';
import {
  createCategory,
  getAllCategories,
} from '../../../../backend/controllers/categoryController';
import { isAdmin } from '../../../../backend/middlewares';
import { isAuthenticatedUser } from '../../../../backend/middlewares/auth';
import onError from '../../../../backend/utils/errors';
const handler = nc({ onError });

dbConnect();

handler.use(isAuthenticatedUser, isAdmin).post(createCategory);

handler.use(isAuthenticatedUser, isAdmin).get(getAllCategories);

export default handler;
