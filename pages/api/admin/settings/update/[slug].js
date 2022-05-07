import nc from 'next-connect';
import dbConnect from '../../../../../backend/config/dbConnect';
import {
  currentCompany,
  updateCompanyDetails,
} from '../../../../../backend/controllers/settingsController';
import { isAdmin } from '../../../../../backend/middlewares';
import { isAuthenticatedUser } from '../../../../../backend/middlewares/auth';

import onError from '../../../../../backend/utils/errors';
const handler = nc({ onError });

dbConnect();

handler.get(currentCompany);
handler.use(isAuthenticatedUser, isAdmin).put(updateCompanyDetails);

export default handler;
