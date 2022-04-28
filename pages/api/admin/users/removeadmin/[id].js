import nc from 'next-connect';
import dbConnect from '../../../../../backend/config/dbConnect';
import onError from '../../../../../backend/utils/errors';
import { isAdmin } from '../../../../../backend/middlewares';
import { isAuthenticatedUser } from '../../../../../backend/middlewares/auth';
import {removeUserAsAdmin } from '../../../../../backend/controllers/userController';

const handler = nc({ onError });

dbConnect();

handler.use(isAuthenticatedUser, isAdmin).put(removeUserAsAdmin);

export default handler;
