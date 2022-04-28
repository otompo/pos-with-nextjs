import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getSession } from 'next-auth/client';

const AdminNav = () => {
  const [current, setCurrent] = useState('');

  useEffect(() => {
    process.browser && setCurrent(window.location.pathname);
  }, [process.browser && window.location.pathname]);

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
      <Link href="/admin/statistics">
        <a
          className={`nav-link  ${current === '/admin/statistics' && 'active'}`}
        >
          Manage Statistics
        </a>
      </Link>
      <Link href="/admin/reports">
        <a className={`nav-link  ${current === '/admin/reports' && 'active'}`}>
          Manage Reports
        </a>
      </Link>
      <Link href="/admin/daily-sales">
        <a
          className={`nav-link  ${
            current === '/admin/daily-sales' && 'active'
          }`}
        >
          Manage Dialy Sales
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

      <Link href="/admin/messages">
        <a className={`nav-link  ${current === '/admin/messages' && 'active'}`}>
          Messages
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
