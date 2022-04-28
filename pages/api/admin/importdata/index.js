import nc from 'next-connect';
import dbConnect from '../../../../backend/config/dbConnect';
import { importProductData } from '../../../../backend/controllers/productController';
import { isAdmin } from '../../../../backend/middlewares';
import { isAuthenticatedUser } from '../../../../backend/middlewares/auth';
import onError from '../../../../backend/utils/errors';
const handler = nc({ onError });

dbConnect();

handler.post(importProductData);

export default handler;
