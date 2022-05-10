import React, { useEffect, useState } from 'react';
import Chart from 'react-google-charts';
import axios from 'axios';
import moment from 'moment';
import AdminRoute from '../routes/AdminRoutes';
import Loader from '../layout/Loader';
import Layout from '../layout/Layout';
import FormatCurrency from '../FormatCurrency';

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
            <div className="card bg-secondary">
              <div className="card-body">
                <div className="card-title">
                  <h5 className="font-weight-bold text-center text-white">
                    Monthly Profit and Loss Chart
                  </h5>
                </div>
                {loading ? (
                  <Loader />
                ) : (
                  <Chart
                    width="100%"
                    height="400px"
                    // chartType="Bar"
                    // chartType="LineChart"
                    // chartType="AreaChart"
                    // chartType="PieChart"
                    chartType="ColumnChart"
                    loader={<div>Loading Chart.....</div>}
                    data={[
                      ['Date', 'Sales', 'Expenses', 'Profit'],
                      ...reports.map((x) => [
                        moment(x.monthSalesDate).format('MMMM Y'),
                        x.totalSales,
                        x.totalExpenses,
                        x.profit,
                        // x.maxPrice * 0.01,
                        // x.minPrice * 0.01,
                      ]),
                    ]}
                  ></Chart>
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
