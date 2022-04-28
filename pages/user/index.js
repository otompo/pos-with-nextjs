import React, { useState, useEffect, useContext } from 'react';
import UserRouter from '../../components/routes/UserRoutes';
import Layout from '../../components/layout/Layout';
import { getSession } from 'next-auth/client';
import { Context } from '../../context';

const UserIndex = () => {
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState('');

  const {
    state: { user },
    dispatch,
  } = useContext(Context);

  useEffect(() => {
    process.browser && setCurrent(window.location.pathname);
  }, [process.browser && window.location.pathname, user]);

  return (
    <Layout title="Dashboard">
      <UserRouter>
        <h1 className="lead">Sales</h1>
        <hr />
      </UserRouter>
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

export default UserIndex;
