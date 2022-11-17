import ManageCategories from '../../components/admin/ManageCategories';
import { getSession } from 'next-auth/client';

const Index = () => {
  return <ManageCategories />;
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
