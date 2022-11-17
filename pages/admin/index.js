import AdminRoute from '../../components/routes/AdminRoutes';
import Dashboard from '../../components/admin/Dashboard';
import Layout from '../../components/layout/Layout';
import { getSession } from 'next-auth/client';

const AdminIndex = () => {
  return (
    <Layout title="Admin Dashboard">
      <AdminRoute>
        <Dashboard />
      </AdminRoute>
    </Layout>
  );
};

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });
  // console.log(session);
  if (!session || !session.user.role.includes('admin')) {
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
export default AdminIndex;
