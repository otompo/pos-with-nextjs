import { CaretUpOutlined, TeamOutlined, BookOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Card from './Card';

const Dashboard = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [products, setProduts] = useState('');
  const [usersTotal, setUsersTotal] = useState([]);
  const [category, setCategory] = useState([]);

  useEffect(() => {
    getTotalUsers();
    showCategory();
    showProducts();
  }, []);

  const showProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/admin/products`);
      setProduts(data.total);
      setLoading(false);
    } catch (err) {
      console.log(err);
      toast.error(err.response.data.message);
      setLoading(false);
    }
  };

  const showCategory = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/admin/category`);
      //console.log(data);
      setCategory(data.total);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const getTotalUsers = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/admin/users`);
      // console.log(data);
      setUsersTotal(data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };
  return (
    <div className="container-fluid" id="admin">
      <div className="row mt-5">
        <Card
          icon={<TeamOutlined style={{ color: 'green' }} />}
          cade_title="Total Staff"
          cade_total={usersTotal.length}
        />

        <Card
          icon={<BookOutlined style={{ color: 'green' }} />}
          cade_title="Total Products"
          cade_total={products && products}
        />

        <Card
          icon={<CaretUpOutlined style={{ color: 'green' }} />}
          cade_title="Total Categories"
          cade_total={category}
        />
      </div>
      <div className="row my-4">
        {/* <div className="col-md-10 offset-md-1">
          <div className="card admin_card">
            <div className="card-body">
              <h5 className="card-title">Newly Joined Staff</h5>
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Created At</th>
                    <th scope="col">Email</th>
                  </tr>
                </thead>
                <tbody>
                  {users &&
                    users.map((user) => {
                      return (
                        <tr key={user._id}>
                          <td>{user.name}</td>
                          <td>{moment(user.createdAt).fromNow()}</td>
                          <td>{user.email}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Dashboard;
