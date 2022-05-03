import React, { useState, useEffect, useContext } from 'react';
import UserRouter from '../../components/routes/UserRoutes';
import Layout from '../../components/layout/Layout';
import { getSession } from 'next-auth/client';
import { Context } from '../../context';
import ManageProductsForSale from '../../components/ManageProductsForSale';

const UserIndex = () => {
  const [current, setCurrent] = useState('');

  const {
    state: { user },
    dispatch,
  } = useContext(Context);

  useEffect(() => {
    process.browser && setCurrent(window.location.pathname);
  }, [process.browser && window.location.pathname, user]);

  return <ManageProductsForSale />;
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

export default UserIndex;
