import { getSession } from 'next-auth/client';
import ManageSettings from '../../../components/admin/ManageSettings';

const Index = () => {
  return (
    <>
      <ManageSettings />
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
export default Index;