import nc from 'next-connect';
import dbConnect from '../../../../backend/config/dbConnect';
import {
  createReport,
  getAllReports,
} from '../../../../backend/controllers/reportController';
import { isAdmin } from '../../../../backend/middlewares';
import { isAuthenticatedUser } from '../../../../backend/middlewares/auth';
import onError from '../../../../backend/utils/errors';
const handler = nc({ onError });

dbConnect();

handler.use(isAuthenticatedUser, isAdmin).post(createReport);
handler.use(isAuthenticatedUser, isAdmin).get(getAllReports);

export default handler;
