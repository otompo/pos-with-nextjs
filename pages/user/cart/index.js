import { getSession } from 'next-auth/client';
import React from 'react';
import ManageCartItems from '../../../components/ManageCartItems';

const Index = () => {
  return <ManageCartItems />;
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
export default Index;
