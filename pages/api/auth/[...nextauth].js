import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
import User from '../../../backend/models/userModel';
import dbConnect from '../../../backend/config/dbConnect';
import { comparePassword } from '../../../backend/utils/authHelpers';

export default NextAuth({
  session: {
    jwt: true,
    maxAge: 30 * 24 * 60 * 60,
  },
  providers: [
    Providers.Credentials({
      async authorize(credentials) {
        dbConnect();

        const { email, password } = credentials;

        // Check if email and password is entered
        if (!email || !password) {
          throw new Error('Please enter email or password');
        }

        // Find user in the database
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
          throw new Error('Invalid Email or Password');
        }

        // Check if password is correct or not
        // const isPasswordMatched = await user.comparePassword(password);

        const isPasswordMatched = await comparePassword(
          password,
          user.password,
        );
        if (!isPasswordMatched) {
          throw new Error('Invalid Email or Password');
        }
        user.password = undefined;
        user.bio = undefined;
        user.createdAt = undefined;
        user.updatedAt = undefined;
        return Promise.resolve(user);
      },
    }),
    // Providers.GitHub({
    //   clientId: process.env.GITHUB_ID,
    //   clientSecret: process.env.GITHUB_SECRET,
    // }),
  ],
  callbacks: {
    jwt: async (token, user) => {
      user && (token.user = user);
      return Promise.resolve(token);
    },
    session: async (session, user) => {
      session.user = user.user;
      return Promise.resolve(session);
    },
  },
});
