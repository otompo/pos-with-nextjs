import ManageProducts from '../../components/admin/ManageProducts';
import { getSession } from 'next-auth/client';
const OurWorksIndex = () => {
  return (
    <>
      <ManageProducts />
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
export default OurWorksIndex;
