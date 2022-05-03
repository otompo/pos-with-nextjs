import Layout from '../../components/layout/Layout';
import { getSession } from 'next-auth/client';
// import ManageProductsForSale from '../../components/ManageProductsForSale';

export default function Index() {
  return <Layout>{/* <ManageProductsForSale /> */}</Layout>;
}

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });

  if (session) {
    return {
      redirect: {
        destination: '/user',
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}
