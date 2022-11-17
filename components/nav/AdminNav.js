import { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import { getSession } from 'next-auth/client';
import LoadingToRedirect from '../LoadingToRedirect';
import axios from 'axios';
import { Context } from '../../context';
import { useRouter } from 'next/router';

const AdminNav = () => {
  const router = useRouter();
  const {
    state: { user },
    dispatch,
  } = useContext(Context);
  const [current, setCurrent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    process.browser && setCurrent(window.location.pathname);
  }, [process.browser && window.location.pathname]);

  useEffect(() => {
    if (user) getCurrentAdmin();
  }, [user]);

  const getCurrentAdmin = async () => {
    try {
      const { data } = await axios.get('/api/admin/current');
      setLoading(false);
    } catch (err) {
      console.log(err);
      router.push('/');
    }
  };

  if (loading) {
    return <LoadingToRedirect />;
  }

  return (
    <div className="nav flex-column nav-pills mt-2">
      <Link href="/admin">
        <a className={`nav-link  ${current === '/admin' && 'active'}`}>
          Admin Dashboard
        </a>
      </Link>
      <Link href="/admin/manage-categories">
        <a
          className={`nav-link  ${
            current === '/admin/manage-categories' && 'active'
          }`}
        >
          Manage Categories
        </a>
      </Link>
      <Link href="/admin/products">
        <a className={`nav-link  ${current === '/admin/products' && 'active'}`}>
          Manage Products
        </a>
      </Link>
      {/* <Link href="/admin/prices">
        <a className={`nav-link  ${current === '/admin/prices' && 'active'}`}>
          Manage Prices
        </a>
      </Link> */}

      <Link href="/admin/daily-sales">
        <a
          className={`nav-link  ${
            current === '/admin/daily-sales' && 'active'
          }`}
        >
          Manage Dialy Sales
        </a>
      </Link>
      <Link href="/admin/expenses">
        <a className={`nav-link  ${current === '/admin/expenses' && 'active'}`}>
          Manage Expenses
        </a>
      </Link>
      <Link href="/admin/reports">
        <a className={`nav-link  ${current === '/admin/reports' && 'active'}`}>
          Manage Reports
        </a>
      </Link>
      <Link href="/admin/statistics">
        <a
          className={`nav-link  ${current === '/admin/statistics' && 'active'}`}
        >
          Manage Statistics
        </a>
      </Link>

      <Link href="/admin/manage-users">
        <a
          className={`nav-link  ${
            current === '/admin/manage-users' && 'active'
          }`}
        >
          Manage Staff
        </a>
      </Link>

      <Link href="/admin/settings">
        <a className={`nav-link  ${current === '/admin/settings' && 'active'}`}>
          Settings
        </a>
      </Link>
    </div>
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
export default AdminNav;
