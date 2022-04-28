import nc from 'next-connect';
import dbConnect from '../../../backend/config/dbConnect';
import { getAllWorks } from '../../../backend/controllers/ourworksController';
import { isAdmin, isAuth } from '../../../backend/middlewares';
import onError from '../../../backend/utils/errors';
const handler = nc({ onError });

dbConnect();

handler.get(getAllWorks);

export default handler;
