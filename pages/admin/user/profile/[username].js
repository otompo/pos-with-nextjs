import { useEffect, useState } from 'react';
import AdminRoute from '../../../../components/routes/AdminRoutes';
import Layout from '../../../../components/layout/Layout';
import { getSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { Avatar } from 'antd';
import moment from 'moment';
import axios from 'axios';

const UserProfilePage = () => {
  const router = useRouter();
  const { username } = router.query;
  const [loading, setLoading] = useState('');
  const [user, setUser] = useState({});

  useEffect(() => {
    loadUser();
  }, [username]);

  const loadUser = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/profile/${username}`);
      // console.log(data);
      setUser(data);
      setLoading(false);
    } catch (err) {
      console.log(err.response.data.message);
      toast.error(err.response.data.message);
      setLoading(false);
    }
  };

  const editUserProfileForm = () => {
    return (
      <div className="container-fluid mt-3">
        <div className="row">
          <div className="col-md-8 offset-md-2">
            <div className="card">
              <div className="card-body">
                <table className="table caption-top table-striped">
                  <thead className="table-light">
                    <tr>
                      <th scope="col">Name</th>
                      <th scope="col">Email</th>
                      <th scope="col">Role</th>
                      <th scope="col">Generated Password</th>
                      <th scope="col">Joined At</th>
                      <th scope="col">Last login</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{user && user.name}</td>
                      <td>{user && user.email}</td>
                      <td>{user && user.role}</td>
                      <td>{user && user.generatedPasword}</td>
                      <td>{moment(user.createdAt).fromNow()}</td>
                      <td>{moment(user.last_login_date).fromNow()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Layout title={user && user.name}>
      <AdminRoute>
        <div>
          <h1 className="lead">{user && user.name}`s Profile</h1>
          <hr />
          {editUserProfileForm()}
        </div>
      </AdminRoute>
    </Layout>
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

export default UserProfilePage;
