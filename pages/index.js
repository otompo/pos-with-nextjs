import Layout from '../components/layout/Layout';
import Login from '../components/auth/Login';
import { getSession } from 'next-auth/client';

export default function Index() {
  return (
    <Layout>
      <Login />
    </Layout>
  );
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
