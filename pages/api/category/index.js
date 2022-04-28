import nc from 'next-connect';
import dbConnect from '../../../backend/config/dbConnect';
import { getAllCategories } from '../../../backend/controllers/categoryController';
import { isAuthenticatedUser } from '../../../backend/middlewares/auth';
import onError from '../../../backend/utils/errors';
const handler = nc({ onError });

dbConnect();

handler.get(getAllCategories);

export default handler;
