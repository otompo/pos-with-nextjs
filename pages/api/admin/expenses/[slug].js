import nc from 'next-connect';
import dbConnect from '../../../../backend/config/dbConnect';
import { isAdmin } from '../../../../backend/middlewares';
import onError from '../../../../backend/utils/errors';
import { isAuthenticatedUser } from '../../../../backend/middlewares/auth';
import {
  getSingleExpenses,
  updateExpenses,
} from '../../../../backend/controllers/expensesController';
const handler = nc({ onError });

dbConnect();

handler.use(isAuthenticatedUser, isAdmin).get(getSingleExpenses);
handler.use(isAuthenticatedUser, isAdmin).put(updateExpenses);

export default handler;
