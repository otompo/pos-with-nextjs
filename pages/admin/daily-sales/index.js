import { getSession } from 'next-auth/client';
import ManageDailySales from '../../../components/admin/ManageDailySales';

const Index = () => {
  return (
    <>
      <ManageDailySales />
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
