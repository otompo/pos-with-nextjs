import { getSession } from 'next-auth/client';
import React from 'react';
import Layout from '../../components/layout/Layout';
import UserRoute from '../../components/routes/UserRoutes';

const FAQ = () => {
  return (
    <Layout>
      <UserRoute>
        <h1 className="lead">FAQS Center</h1>
        <hr />
      </UserRoute>
    </Layout>
  );
};

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}
export default FAQ;
