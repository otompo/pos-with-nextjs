import nc from 'next-connect';
import dbConnect from '../../../../backend/config/dbConnect';
import {
  createCompanyDetails,
  getCurrentCompany,
} from '../../../../backend/controllers/settingsController';
import { isAdmin } from '../../../../backend/middlewares';
import { isAuthenticatedUser } from '../../../../backend/middlewares/auth';

import onError from '../../../../backend/utils/errors';
const handler = nc({ onError });

dbConnect();

handler.use(isAuthenticatedUser, isAdmin).post(createCompanyDetails);
handler.use(isAuthenticatedUser, isAdmin).get(getCurrentCompany);

export default handler;
