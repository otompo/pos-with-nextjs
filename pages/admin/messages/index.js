import { getSession } from 'next-auth/client';
import ManageMessages from '../../../components/admin/ManageMessages';

const MessagesIndex = () => {
  return (
    <>
      <ManageMessages />
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
export default MessagesIndex;
