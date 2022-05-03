import { CaretUpOutlined, TeamOutlined, BookOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Card from './Card';

const Dashboard = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [products, setProduts] = useState([]);
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
          cade_total={loading ? <Spin /> : usersTotal.length}
        />

        <Card
          icon={<BookOutlined style={{ color: 'green' }} />}
          cade_title="Total Products"
          cade_total={loading ? <Spin /> : products}
        />

        <Card
          icon={<CaretUpOutlined style={{ color: 'green' }} />}
          cade_title="Total Categories"
          cade_total={loading ? <Spin /> : category}
        />
        <Card
          icon={<CaretUpOutlined style={{ color: 'green' }} />}
          cade_title="Total Orders"
          cade_total={loading ? <Spin /> : category}
        />
      </div>
    </div>
  );
};

export default Dashboard;
