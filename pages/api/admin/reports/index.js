import nc from 'next-connect';
import dbConnect from '../../../../backend/config/dbConnect';
import { createReport } from '../../../../backend/controllers/reportController';
import { isAdmin } from '../../../../backend/middlewares';
import { isAuthenticatedUser } from '../../../../backend/middlewares/auth';
import onError from '../../../../backend/utils/errors';
const handler = nc({ onError });

dbConnect();

handleruse(isAuthenticatedUser, isAdmin).post(createReport);

export default handler;
