import nc from 'next-connect';
import dbConnect from '../../../../backend/config/dbConnect';
import { createCompanyDetails } from '../../../../backend/controllers/settingsController';
import { isAuthenticatedUser } from '../../../../backend/middlewares/auth';
import { isAdmin } from '../../../../backend/middlewares';
import onError from '../../../../backend/utils/errors';
const handler = nc({ onError });

dbConnect();

handler.use(isAuthenticatedUser, isAdmin).post(createCompanyDetails);

export default handler;
