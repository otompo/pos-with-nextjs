import nc from 'next-connect';
import dbConnect from '../../../../../backend/config/dbConnect';
// import { userPublicProfile } from '../../../../../backend/controllers/userController';
import onError from '../../../../../backend/utils/errors';
const handler = nc({ onError });

dbConnect();

// handler.get(userPublicProfile);

export default handler;
