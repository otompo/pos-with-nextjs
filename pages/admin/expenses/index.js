import { getSession } from 'next-auth/client';
import ManageExpenses from '../../../components/admin/ManageExpenses';

const Index = () => {
  return (
    <>
      <ManageExpenses />
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
