import React, { useEffect, useState } from 'react';
import Layout from '../layout/Layout';
import AdminRoute from '../routes/AdminRoutes';
import FormatCurrency from '../FormatCurrency';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { Button } from 'antd';
import moment from 'moment';
import { toast } from 'react-toastify';

function ManageReports(props) {
  const [salesStartDate, setSalesStartDate] = useState(new Date());
  const [salesEndDate, setSalesEndDate] = useState(new Date());
  const [expensesStartDate, setExpensesStartDate] = useState(new Date());
  const [expensesEndDate, setExpensesEndDate] = useState(new Date());
  const [totalSales, setTotalSales] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [profit, setProfit] = useState(0);
  console.log('profit', profit);

  useEffect(() => {
    setProfit(totalSales - totalExpenses);
  }, [totalSales, totalExpenses]);

  const handleSalesSubmit = async () => {
    try {
      const { data } = await axios.get(
        `/api/admin/sales/totalsalesforseslecteddays?salesStartDate=${moment(
          salesStartDate,
        ).format('Y/MM/DD')}&salesEndDate=${moment(salesEndDate).format(
          'Y/MM/DD',
        )}`,
      );

      setTotalSales(data.grandTotal);
    } catch (err) {
      console.log(err);
    }
  };

  const handleExpensesSubmit = async () => {
    try {
      const { data } = await axios.get(
        `/api/admin/expenses/totalexpensesforadays?salesStartDate=${moment(
          expensesStartDate,
        ).format('Y/MM/DD')}&salesEndDate=${moment(expensesEndDate).format(
          'Y/MM/DD',
        )}`,
      );
      setTotalExpenses(data.amount);
    } catch (err) {
      console.log(err);
    }
  };
  const handleSubmitData = async () => {
    try {
      const { data } = await axios.post(`/api/admin/reports`, {
        salesStartDate,
        salesEndDate,
        expensesStartDate,
        expensesEndDate,
        totalSales,
        totalExpenses,
        profit,
      });
      toast.success('Success');
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <Layout title="Manage Reports">
      <AdminRoute>
        <h1 className="lead">Manage Reports</h1>
        <hr />
        <div className="row">
          <div className="col-md-6">
            <h4 className="lead text-center">
              SELECT START AND END DATE FOR TOTAL SALES
            </h4>

            <div className="row">
              <div className="col-md-5">
                <DatePicker
                  className="w-100"
                  selected={salesStartDate}
                  onChange={(date) => setSalesStartDate(date)}
                  // minDate={new Date()}
                  dateFormat="dd/MM/YYY"
                  isClearable
                  placeholderText="I have been cleared!"
                />
              </div>
              <div className="col-md-5">
                <DatePicker
                  className="w-100"
                  selected={salesEndDate}
                  onChange={(date) => setSalesEndDate(date)}
                  // minDate={new Date()}
                  dateFormat="dd/MM/YYY"
                  isClearable
                  placeholderText="I have been cleared!"
                />
              </div>
              <div className="col-md-2">
                <Button
                  shape="round"
                  type="primary"
                  onClick={handleSalesSubmit}
                >
                  Submit
                </Button>
              </div>
            </div>

            <div className="card my-4 bg-success">
              <div className="card-body text-center">
                <h4> TOTAL SALES</h4>
                <div className="text-secondary">
                  <h2 className="text-white">
                    {FormatCurrency(Number(totalSales))}{' '}
                  </h2>
                  {/* <h2>{JSON.stringify(totalSales, null, 4)} </h2> */}
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <h4 className="lead text-center">
              SELECT START AND END DATE FOR TOTAL EXPENSES
            </h4>
            <div className="row">
              <div className="col-md-5">
                <DatePicker
                  className="w-100"
                  selected={expensesStartDate}
                  onChange={(date) => setExpensesStartDate(date)}
                  // minDate={new Date()}
                  dateFormat="dd/MM/YYY"
                  isClearable
                  placeholderText="I have been cleared!"
                />
              </div>
              <div className="col-md-5">
                <DatePicker
                  className="w-100"
                  selected={expensesEndDate}
                  onChange={(date) => setExpensesEndDate(date)}
                  // minDate={new Date()}
                  dateFormat="dd/MM/YYY"
                  isClearable
                  placeholderText="I have been cleared!"
                />
              </div>
              <div className="col-md-2">
                <Button
                  shape="round"
                  type="primary"
                  onClick={handleExpensesSubmit}
                >
                  Submit
                </Button>
              </div>
            </div>
            <div className="card my-4 bg-primary">
              <div className="card-body text-center">
                <h4>TOTAL EXPENSES</h4>
                <div className="text">
                  <h2 className="text-white">
                    {FormatCurrency(Number(totalExpenses))}{' '}
                  </h2>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <div className="card my-4 bg-secondary">
                <div className="card-body text-center">
                  <h4>PROFIT</h4>
                  <div className="text">
                    <h2 className="text-white">
                      {FormatCurrency(Number(totalSales - totalExpenses))}{' '}
                    </h2>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 text-center mt-5">
              <h4 className="lead">CLICK ON BUTTON BELOW TO SAVE DATA</h4>
              <div className="text">
                <Button
                  type="primary"
                  size="large"
                  shape="round"
                  style={{ width: '50%' }}
                  onClick={handleSubmitData}
                >
                  Save Data
                </Button>
              </div>
            </div>
          </div>
        </div>
      </AdminRoute>
    </Layout>
  );
}

export default ManageReports;
