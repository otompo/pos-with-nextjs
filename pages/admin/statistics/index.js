import { getSession } from 'next-auth/client';
import ManageStatistics from '../../../components/admin/ManageStatistics';

const Index = () => {
  return (
    <>
      <ManageStatistics />
    </>
  );
};

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });

  if (!session || !session.user.role.includes('admin')) {
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
