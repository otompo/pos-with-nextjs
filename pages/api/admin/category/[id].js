import nc from 'next-connect';
import dbConnect from '../../../../backend/config/dbConnect';
import { deleteCategory } from '../../../../backend/controllers/categoryController';
import { isAdmin } from '../../../../backend/middlewares';
import { isAuthenticatedUser } from '../../../../backend/middlewares/auth';
import onError from '../../../../backend/utils/errors';
const handler = nc({ onError });

dbConnect();

handler.use(isAuthenticatedUser, isAdmin).delete(deleteCategory);

export default handler;
