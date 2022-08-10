import { CaretUpOutlined, TeamOutlined, BookOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Card from './Card';
import { Line } from 'react-chartjs-2';
import Loader from '../layout/Loader';
import { toast } from 'react-hot-toast';
import moment from 'moment';

const Dashboard = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [products, setProduts] = useState([]);
  const [usersTotal, setUsersTotal] = useState([]);
  const [totalSales, setTotalSales] = useState([]);
  const [category, setCategory] = useState([]);
  const [dailySales, setDailySales] = useState([]);

  useEffect(() => {
    getTotalUsers();
    showCategory();
    showProduct();
    getTotalSales();
    showDailySales();
  }, []);

  const showDailySales = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/admin/statistics/monthlyplan`);
      setDailySales(data.dailySales);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const showProduct = async () => {
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

  const getTotalSales = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/admin/sales`);
      // console.log(data);
      setTotalSales(data.total);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const lineChartData = {
    labels: dailySales.map((x) => [moment(x._id).format('LL')]),
    datasets: [
      {
        data: dailySales.map((x) => x.totalSales),
        label: 'Total Sales',
        borderColor: '#3333ff',
        backgroundColor: '#F2CC59',
        fill: true,
        lineTension: 0.5,
      },
      {
        data: dailySales.map((x) => x.quantitySold),
        label: 'Quantity Sold',
        borderColor: '#ff3333',
        backgroundColor: 'rgba(255, 0, 0, 0.5)',
        fill: true,
        lineTension: 0.5,
      },
      {
        data: dailySales.map((x) => x.numOfSales),
        label: 'Number Of Sales',
        borderColor: '#F2CC59',
        backgroundColor: 'rgba(255, 0, 0, 0.5)',
        fill: true,
        lineTension: 0.5,
      },
    ],
  };

  return (
    <>
      <div className="container-fluid" id="admin">
        <div className="row mt-5">
          <Card
            backgroundColor="#33195a"
            icon={<TeamOutlined style={{ color: 'green' }} />}
            cade_title="Total Staff"
            cade_total={loading ? <Spin /> : usersTotal.length}
          />

          <Card
            backgroundColor="#e3d002"
            icon={<BookOutlined style={{ color: 'green' }} />}
            cade_title="Total Products"
            cade_total={loading ? <Spin /> : products}
          />

          <Card
            backgroundColor="#2F02E3"
            icon={<CaretUpOutlined style={{ color: 'green' }} />}
            cade_title="Total Categories"
            cade_total={loading ? <Spin /> : category}
          />
          <Card
            backgroundColor="#22cc56"
            icon={<CaretUpOutlined style={{ color: 'green' }} />}
            cade_title="Total Sales"
            cade_total={loading ? <Spin /> : totalSales}
          />
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-body">
              <div className="card-title ">
                <h5 className="font-weight-bold text-center">
                  Daily Sales Chart
                </h5>
              </div>
              {loading ? (
                <Loader />
              ) : (
                <Line
                  height={90}
                  options={{
                    legend: {
                      display: true,
                      position: 'right',
                    },
                  }}
                  data={lineChartData}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
