import nc from 'next-connect';
import dbConnect from '../../../backend/config/dbConnect';
import { getAllWorks } from '../../../backend/controllers/ourworksController';

import onError from '../../../backend/utils/errors';
const handler = nc({ onError });

dbConnect();

handler.get(getAllWorks);

export default handler;
