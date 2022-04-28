import { getSession } from 'next-auth/client';
import ManageUsers from '../../components/admin/ManageUsers';

const Manage = () => {
  return (
    <>
      <ManageUsers />
    </>
  );
};

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });

  if (!session || !session.user.role.includes('Admin')) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}

export default Manage;
