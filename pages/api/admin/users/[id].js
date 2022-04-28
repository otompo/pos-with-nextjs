import nc from 'next-connect';
import dbConnect from '../../../../backend/config/dbConnect';
import onError from '../../../../backend/utils/errors';
import { isAdmin } from '../../../../backend/middlewares';
import { isAuthenticatedUser } from '../../../../backend/middlewares/auth';
import {
  //   makeUserAdmin,
  removeUser,
} from '../../../../backend/controllers/userController';
import { removeUserAsAdmin } from '../../../../backend/controllers/adminController';

const handler = nc({ onError });

dbConnect();

handler.use(isAuthenticatedUser, isAdmin).put(removeUserAsAdmin);
handler.use(isAuthenticatedUser, isAdmin).delete(removeUser);

export default handler;
