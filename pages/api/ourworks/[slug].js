import nc from 'next-connect';
import dbConnect from '../../../backend/config/dbConnect';
import { relatedWorks } from '../../../backend/controllers/ourworksController';
import onError from '../../../backend/utils/errors';
const handler = nc({ onError });

dbConnect();

handler.get(relatedWorks);

export default handler;
