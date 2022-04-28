import { getSession } from 'next-auth/client';
import ManageProductsInstock from '../../../../components/admin/ManageProductsInstock';

const Index = () => {
  return (
    <>
      <ManageProductsInstock />
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
