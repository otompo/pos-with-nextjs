import nc from 'next-connect';
import { readRelatedFeaturePrices } from '../../../backend/controllers/featurePriceController';
import dbConnect from '../../../backend/config/dbConnect';
import onError from '../../../backend/utils/errors';
const handler = nc({ onError });

dbConnect();

handler.get(readRelatedFeaturePrices);

export default handler;
