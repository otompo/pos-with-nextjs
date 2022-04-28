import UserRoute from '../../../components/routes/UserRoutes';
import Layout from '../../../components/layout/Layout';
import { getSession } from 'next-auth/client';
import Profile from '../../../components/user/Profile';

const UserProfilePage = () => {
  return (
    <>
      <Profile />
    </>
  );
};

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}
export default UserProfilePage;
