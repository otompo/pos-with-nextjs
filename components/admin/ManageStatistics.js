import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import AdminRoute from '../routes/AdminRoutes';
import Loader from '../layout/Loader';
import Layout from '../layout/Layout';
import FormatCurrency from '../FormatCurrency';
import { Bar } from 'react-chartjs-2';

const ManageStatistics = () => {
  const [grandTotalSales, setGrandTotalSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    showDailySales();
  }, []);

  const showDailySales = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/admin/statistics/monthlyplan`);
      setGrandTotalSales(data.sales);
      setProducts(data.productStats);
      setReports(data.reports);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const lineChartData = {
    labels: reports.map((x) => moment(x.monthSalesDate).format('MMMM Y')),
    datasets: [
      {
        data: reports.map((x) => x.totalSales),
        label: 'Sales',
        backgroundColor: '#3333ff',
        fill: true,
        lineTension: 0.5,
      },
      {
        data: reports.map((x) => x.totalExpenses),
        label: 'Expenses',
        backgroundColor: '#ff3333',
        fill: true,
        lineTension: 0.5,
      },
      {
        data: reports.map((x) => x.profit),
        label: 'Profit',
        backgroundColor: '#F2CC59',
        fill: true,
        lineTension: 0.5,
      },
    ],
  };

  return (
    <Layout title="Manage Statistics">
      <AdminRoute>
        <h1 className="lead">Statistics</h1>
        {/* {reports && reports.map((report) => <h6>{report.totalSales}</h6>)} */}
        <hr />
        <div className="row mb-3" id="statistics">
          <div className="col-md-3">
            <div className="card my-4 bg-primary">
              <div className="card-body text-center">
                <h4>GRAND TOTAL SALES</h4>
                <div className="text">
                  {grandTotalSales &&
                    grandTotalSales.map((total, i) => (
                      <h2 className="text-white" key={i}>
                        {FormatCurrency(total.totalSales)}
                      </h2>
                    ))}
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card my-4 bg-success">
              <div className="card-body text-center">
                <h4>GRAND TOTAL QTY SOLD</h4>
                <div className="text">
                  {grandTotalSales &&
                    grandTotalSales.map((total, i) => (
                      <h2 className="text-white" key={i}>
                        {total.quantitySold}
                      </h2>
                    ))}
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card my-4 bg-danger">
              <div className="card-body text-center">
                <h4>GRAND TOTAL PRICES REMAINING</h4>
                <div className="text">
                  {products.map((product, i) => (
                    <h2 className="text-white" key={i}>
                      {FormatCurrency(product.totalPrice)}
                    </h2>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card my-4 bg-info">
              <div className="card-body text-center">
                <h4>GRAND TOTAL QTY REMAINING</h4>
                <div className="text">
                  {products.map((product, i) => (
                    <h2 className="text-white" key={i}>
                      {product.totalQuantity}
                    </h2>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row my-2">
          <div className="col-md-12">
            <div className="card">
              <div className="card-body">
                <div className="card-title">
                  <h5 className="font-weight-bold text-center text-white">
                    Monthly Profit and Loss Chart
                  </h5>
                </div>
                {loading ? (
                  <Loader />
                ) : (
                  <Bar
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

        {/* <pre>{JSON.stringify(reports, null, 4)}</pre> */}
      </AdminRoute>
    </Layout>
  );
};

export default ManageStatistics;
