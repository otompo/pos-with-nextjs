import React, { useRef, useEffect, useState } from 'react';
import Layout from '../layout/Layout';
import AdminRoute from '../routes/AdminRoutes';
import FormatCurrency from '../FormatCurrency';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { MDBDataTable } from 'mdbreact';
import moment from 'moment';
import axios from 'axios';
import { Button, Modal, Spin, Avatar } from 'antd';
import { PrinterOutlined } from '@ant-design/icons';
import { toast } from 'react-hot-toast';
import Loader from '../layout/Loader';
import ReactToPrint from 'react-to-print';
import ConvertError from '../../hooks/ConvertError';
import useSettings from '../../hooks/useSettings';
import renderHTML from 'react-render-html';
const { confirm } = Modal;

function ManageReports(props) {
  const [salesStartDate, setSalesStartDate] = useState(new Date());
  const [salesEndDate, setSalesEndDate] = useState(new Date());

  const [costStartDate, setCostStartDate] = useState(new Date());
  const [costEndDate, setCostEndDate] = useState(new Date());

  const [expensesStartDate, setExpensesStartDate] = useState(new Date());
  const [expensesEndDate, setExpensesEndDate] = useState(new Date());

  const [totalSales, setTotalSales] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [profit, setProfit] = useState(0);
  const [subProfit, setSubProfit] = useState(0);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [tempData, setTempData] = useState([]);

  const showPrintData = (report) => {
    let tempData = [report];
    setTempData((item) => [...tempData]);
    return showModal();
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const componentRef = useRef();

  const handlePrint = () => {
    window.print();
  };

  const {
    name,
    address,
    email,
    contactNumber,
    website,
    companyLogo,
    description,
  } = useSettings();

  useEffect(() => {
    setSubProfit(totalSales - totalCost);
    setProfit(subProfit - totalExpenses);
  }, [totalSales, totalCost, subProfit, totalExpenses]);

  useEffect(() => {
    handleSalesSubmit();
    handleExpensesSubmit();
    handleCostSubmit();
  }, []);

  useEffect(() => {
    getAllReports();
  }, [success]);

  const handleCostSubmit = async () => {
    try {
      const { data } = await axios.get(
        `/api/admin/cost/totalcostforseslecteddays?costStartDate=${moment(
          costStartDate,
        ).format('Y/MM/DD')}&costEndDate=${moment(costEndDate).format(
          'Y/MM/DD',
        )}`,
      );
      setTotalCost(data.total);
    } catch (err) {
      console.log(err);
    }
  };

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
        `/api/admin/expenses/totalexpensesforadays?expensesStartDate=${moment(
          expensesStartDate,
        ).format('Y/MM/DD')}&expensesEndDate=${moment(expensesEndDate).format(
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
      // setLoading(true);
      setSuccess(true);
      const { data } = await axios.post(`/api/admin/reports`, {
        totalCost,
        totalSales,
        totalExpenses,
        profit,
        subProfit,
        costStartDate,
        costEndDate,
        salesStartDate,
        salesEndDate,
        expensesStartDate,
        expensesEndDate,
      });
      // setLoading(false);
      setSuccess(false);
      toast.success('Success');
    } catch (err) {
      console.log(err);
      toast.error(err.response.data.message);
      setSuccess(false);
    }
  };

  const getAllReports = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(`/api/admin/reports`);
      setReports(data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const setData = () => {
    const data = {
      columns: [
        {
          label: 'Created At',
          field: 'createdat',
          sort: 'asc',
        },
        {
          label: 'Sales Start Date',
          field: 'salesstartdate',
          sort: 'asc',
        },
        {
          label: 'Sales End Date',
          field: 'salesenddate',
          sort: 'asc',
        },
        {
          label: 'Expenses Start Date',
          field: 'expensesstartdate',
          sort: 'asc',
        },
        {
          label: 'Expenses End Date',
          field: 'expensessenddate',
          sort: 'asc',
        },
        {
          label: 'Total Sales',
          field: 'totalsales',
          sort: 'asc',
        },
        {
          label: 'Total Expenses',
          field: 'totalexpenses',
          sort: 'asc',
        },

        {
          label: 'Total Profit',
          field: 'profit',
          sort: 'asc',
        },
        {
          label: 'Action',
          field: 'action',
          sort: 'asc',
        },
      ],
      rows: [],
    };

    reports &&
      reports.forEach((report, index) => {
        data.rows.push({
          createdat: `${moment(report.createdAt).format('LL')}`,
          salesstartdate: `${moment(report.salesStartDate).format('LL')}`,
          salesenddate: `${moment(report.salesEndDate).format('LL')}`,
          expensesstartdate: `${moment(report.expensesStartDate).format('LL')}`,
          expensessenddate: `${moment(report.expensesEndDate).format('LL')}`,
          createdat: `${moment(report.createdAt).format('LL')}`,
          totalsales: `${FormatCurrency(report.totalSales)}`,
          totalexpenses: `${FormatCurrency(report.totalExpenses)}`,
          profit: `${FormatCurrency(report.profit)}`,

          action: (
            <>
              <button
                className="btn btn-danger mx-2"
                onClick={() => showPrintData(report)}
              >
                <PrinterOutlined style={{ fontSize: 25 }} />
              </button>
            </>
          ),
        });
      });

    return data;
  };

  return (
    <Layout title="Manage Reports">
      <AdminRoute>
        <h1 className="lead">Manage Reports</h1>
        <hr />
        <div className="row">
          <div className="col-md-4">
            <h4 className="lead text-center">COST START AND END DATE</h4>

            <div className="row">
              <div className="col-md-4">
                <DatePicker
                  className="w-100"
                  selected={costStartDate}
                  onChange={(date) => setCostStartDate(date)}
                  // minDate={new Date()}
                  dateFormat="MMMM d, yyyy"
                  isClearable
                  placeholderText="I have been cleared!"
                />
              </div>
              <div className="col-md-4">
                <DatePicker
                  className="w-100"
                  selected={costEndDate}
                  onChange={(date) => setCostEndDate(date)}
                  // minDate={new Date()}
                  dateFormat="MMMM d, yyyy"
                  isClearable
                  placeholderText="I have been cleared!"
                />
              </div>
              <div className="col-md-4">
                <Button
                  shape="round"
                  type="primary"
                  onClick={handleCostSubmit}
                  block
                >
                  Submit
                </Button>
              </div>
            </div>

            <div className="card my-4 bg-success">
              <div className="card-body text-center">
                <h4> TOTAL COST</h4>
                <div className="text-secondary">
                  <h2 className="text-white">
                    {FormatCurrency(ConvertError(Number(totalCost)))}
                  </h2>
                  {/* <h2>{JSON.stringify(totalSales, null, 4)} </h2> */}
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <h4 className="lead text-center">SALES START AND END DATE</h4>

            <div className="row">
              <div className="col-md-4">
                <DatePicker
                  className="w-100"
                  selected={salesStartDate}
                  onChange={(date) => setSalesStartDate(date)}
                  // minDate={new Date()}
                  dateFormat="MMMM d, yyyy"
                  isClearable
                  placeholderText="I have been cleared!"
                />
              </div>
              <div className="col-md-4">
                <DatePicker
                  className="w-100"
                  selected={salesEndDate}
                  onChange={(date) => setSalesEndDate(date)}
                  // minDate={new Date()}
                  dateFormat="MMMM d, yyyy"
                  isClearable
                  placeholderText="I have been cleared!"
                />
              </div>
              <div className="col-md-4">
                <Button
                  shape="round"
                  type="primary"
                  onClick={handleSalesSubmit}
                  block
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

          <div className="col-md-4">
            <h4 className="lead text-center">EXPENSES START AND END DATE</h4>
            <div className="row">
              <div className="col-md-4">
                <DatePicker
                  className="w-100"
                  selected={expensesStartDate}
                  onChange={(date) => setExpensesStartDate(date)}
                  // minDate={new Date()}
                  dateFormat="MMMM d, yyyy"
                  isClearable
                  placeholderText="I have been cleared!"
                />
              </div>
              <div className="col-md-4">
                <DatePicker
                  className="w-100"
                  selected={expensesEndDate}
                  onChange={(date) => setExpensesEndDate(date)}
                  // minDate={new Date()}
                  dateFormat="MMMM d, yyyy"
                  isClearable
                  placeholderText="I have been cleared!"
                />
              </div>
              <div className="col-md-4">
                <Button
                  shape="round"
                  type="primary"
                  onClick={handleExpensesSubmit}
                  block
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
            <div className="col-md-4">
              <div className="card my-4 bg-secondary">
                <div className="card-body text-center">
                  <h4>SUB PROFIT (SALES-COST)</h4>
                  <div className="text">
                    <h2 className="text-white">
                      {FormatCurrency(ConvertError(Number(subProfit)))}{' '}
                    </h2>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card my-4 bg-secondary">
                <div className="card-body text-center">
                  <h5>PROFIT ((SALES-COST)-EXPENSES)</h5>
                  <div className="text">
                    <h2 className="text-white">
                      {FormatCurrency(
                        ConvertError(Number(subProfit - totalExpenses)),
                      )}{' '}
                    </h2>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4 text-center mt-5">
              <h4 className="lead">CLICK ON BUTTON BELOW TO SAVE DATA</h4>
              <div className="text">
                <Button
                  type="primary"
                  size="large"
                  shape="round"
                  style={{ width: '50%' }}
                  onClick={handleSubmitData}
                >
                  {/* {loading ? <Spin /> : 'Save Data'} */}
                  Save
                </Button>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="card">
                <div className="card-body">
                  {loading ? (
                    <Loader />
                  ) : (
                    <MDBDataTable
                      data={setData()}
                      className="px-3"
                      bordered
                      striped
                      hover
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <Modal
          title="Receipt"
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={null}
          width={700}
        >
          <div className="invoice__preview bg-white  rounded">
            <div ref={componentRef} className="p-5" id="invoice__preview">
              {/*<p className="c_logo" key={item._id}>
                    {item.logo ? (
                      <Avatar size={90} src={item && item.logo} />
                    ) : (
                      <Avatar size={90} src={item && item.logoDefualt} />
                    )}
                  </p> */}
              <div className="container">
                <div className="row">
                  <div className="col-md-12">
                    <ul>
                      <li>
                        <h2>{name}</h2>
                      </li>
                      <li>
                        <h6 className="d-inline">Email:</h6> {email}
                      </li>
                      <li>
                        <h6 className="d-inline">Website:</h6> {website}
                      </li>
                      <li>
                        <h6 className="d-inline">Contact:</h6> {contactNumber}
                      </li>
                      <li>
                        <h6 className="d-inline">Address:</h6> {address}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <hr />
              <div className="container">
                <div className="row">
                  <div className="col-md-12">
                    {tempData.map((temp) => (
                      <h5 className="text-center text-uppercase" key={temp._id}>
                        Report on Sales for the Period of <br />
                        <span className="text-primary">
                          {moment(temp.salesStartDate).format('LL')} to{' '}
                          {moment(temp.salesEndDate).format('LL')}
                        </span>
                      </h5>
                    ))}
                  </div>
                </div>
              </div>
              <hr />

              {tempData.map((temp) => (
                <>
                  <article
                    className="mt-10 mb-14 flex items-end justify-end"
                    key={temp._id}
                  >
                    <h5 className="d-inline">Total Sales:</h5>{' '}
                    <p
                      className="d-inline"
                      style={{
                        fontWeight: 'bold',
                        fontSize: '18px',
                        color: '#ff8c00',
                      }}
                    >
                      {' '}
                      {FormatCurrency(temp.totalSales)}
                    </p>
                  </article>
                  <article className="mt-10 mb-14 flex items-end justify-end">
                    <h5 className="d-inline">Total Expenses:</h5>
                    <p
                      className="d-inline"
                      style={{
                        fontWeight: 'bold',
                        fontSize: '18px',
                        color: '#ff8c00',
                      }}
                    >
                      {' '}
                      {FormatCurrency(temp.totalExpenses)}
                    </p>
                  </article>
                  <article className="mt-10 mb-14 flex items-end justify-end">
                    <h5 className="d-inline">Total Profit:</h5>
                    <p
                      className="d-inline"
                      style={{
                        fontWeight: 'bold',
                        fontSize: '18px',
                        color: '#ff8c00',
                      }}
                    >
                      {' '}
                      {FormatCurrency(temp.profit)}
                    </p>
                  </article>
                </>
              ))}

              <hr />

              <p className="descreption">
                <span className="lead" style={{ fontSize: '15px' }}>
                  {renderHTML(description)}
                </span>
              </p>
            </div>
          </div>
          <div className="container">
            <div className="row">
              <div className="col-md-4 offset-md-4">
                <ReactToPrint
                  trigger={() => (
                    <button className="btn btn-primary float-right">
                      Print / Download
                    </button>
                  )}
                  content={() => componentRef.current}
                />
              </div>
            </div>
          </div>
        </Modal>
      </AdminRoute>
    </Layout>
  );
}

export default ManageReports;
