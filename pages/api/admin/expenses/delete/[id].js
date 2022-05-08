import nc from 'next-connect';
import dbConnect from '../../../../../backend/config/dbConnect';
import { isAdmin } from '../../../../../backend/middlewares';
import onError from '../../../../../backend/utils/errors';
import { isAuthenticatedUser } from '../../../../../backend/middlewares/auth';
import { deleteExpenses } from '../../../../../backend/controllers/expensesController';
const handler = nc({ onError });

dbConnect();

handler.use(isAuthenticatedUser, isAdmin).delete(deleteExpenses);

export default handler;
