import React, { useRef, useEffect, useState } from 'react';
import AdminRoute from '../routes/AdminRoutes';
import Layout from '../layout/Layout';
import moment from 'moment';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { PrinterOutlined } from '@ant-design/icons';
import Loader from '../layout/Loader';
import { Button, Modal, Avatar } from 'antd';
import ReactToPrint from 'react-to-print';
import FormatCurrency from '../FormatCurrency';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { MDBDataTable } from 'mdbreact';

const { confirm } = Modal;

const ManageDailySales = () => {
  const [dateRange, setDateRange] = useState([new Date(), new Date()]);
  const [startdate, enddate] = dateRange;
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [quantitySold, setQuantitySold] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showPrintData = () => {
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

  const onChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  useEffect(() => {
    handleSalesSubmit();
  }, []);

  const handleSalesSubmit = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `/api/admin/sales/salesforaparticulardate?startdate=${moment(
          startdate,
        ).format('Y/MM/DD')}&enddate=${moment(enddate).format('Y/MM/DD')}`,
      );
      setSales(data.docs);
      setQuantitySold(data.result.quantitySold);
      setTotalAmount(data.result.grandTotal);
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
          label: 'Products Name',
          field: 'productsname',
          sort: 'asc',
        },
        {
          label: 'Quantity Sold',
          field: 'quantity',
          sort: 'asc',
        },

        {
          label: 'Sub Total',
          field: 'subtotal',
          sort: 'asc',
        },
        {
          label: 'Total Tax',
          field: 'totaltax',
          sort: 'asc',
        },
        {
          label: 'Grand Total',
          field: 'grandtotal',
          sort: 'asc',
        },
      ],
      rows: [],
    };

    sales &&
      sales.forEach((sale, index) => {
        data.rows.push({
          productsname: (
            <span>
              {sale.products.map((product) => (
                <span key={product._id}>
                  <h6 style={{ color: '#e74c3c' }}>{product.name}</h6>
                  <h6 className="d-inline pl-4">Selling Price:</h6> GH&#x20B5;
                  {FormatCurrency(product.sellingPrice)}
                  <h6 className="d-inline pl-2">Quantity:</h6> {product.count}
                  <br />
                </span>
              ))}
            </span>
          ),
          quantity: `${sale.quantitySold}`,
          subtotal: `${FormatCurrency(sale.subTotal)}`,
          grandtotal: `${FormatCurrency(sale.grandTotal)}`,
        });
      });

    return data;
  };

  return (
    <Layout title="Manage Daily Sales">
      <AdminRoute>
        <div className="row my-3">
          <div className="col-md-10">
            <h1 className="lead">Manage Manage Daily Sales</h1>
          </div>
          <div className="col-md-2">
            <button className="btn btn-danger mx-2" onClick={showPrintData}>
              <PrinterOutlined style={{ fontSize: 25 }} />
            </button>
          </div>
        </div>
        <hr />

        <div className="row my-5">
          <div className="col-md-6 text-center">
            <h4 className="lead mb-4">
              SELECT START AND END DATE FOR SALES IN A DAY
            </h4>
            <div className="row">
              <div className="col-md-8">
                <DatePicker
                  selectsRange={true}
                  className="w-100"
                  startDate={startdate}
                  endDate={enddate}
                  dateFormat="MMMM d, yyyy"
                  onChange={(update) => {
                    setDateRange(update);
                  }}
                  isClearable={true}
                />
              </div>
              <div className="col-md-4">
                <Button
                  shape="round"
                  type="primary"
                  onClick={handleSalesSubmit}
                >
                  Submit
                </Button>
              </div>
            </div>
          </div>
          <div className="col-md-6 text-center">
            <div className="row">
              <div className="col-md-6">
                <h6 className="d-inline text-uppercase">AMOUNT</h6>{' '}
                <Avatar size={100} style={{ backgroundColor: '#87d068' }}>
                  {totalAmount && FormatCurrency(totalAmount)}
                </Avatar>
              </div>
              <div className="col-md-6">
                <h6 className="d-inline text-uppercase">QTY SOLD</h6>{' '}
                <Avatar size={100} style={{ backgroundColor: '#87d068' }}>
                  {quantitySold && quantitySold}
                </Avatar>
              </div>
            </div>
          </div>
        </div>
        <hr />
        <div className="row">
          <div className="col-md-12">
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
        <Modal
          title="LIST OF SALES SELECTED"
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={null}
          width={700}
        >
          <div className="invoice__preview bg-white  rounded">
            <div ref={componentRef} className="p-5" id="invoice__preview">
              <h5 className="text-uppercase">
                LIST OF SALES FROM{' '}
                <span className="text-primary">
                  {moment(startdate).format('LL')} TO{' '}
                  {moment(enddate).format('LL')}
                </span>
              </h5>
              <hr />
              <h5 className="text-uppercase">
                TOTAL AMOUNT OF SALES:{' '}
                <span className="text-primary">
                  {totalAmount && FormatCurrency(totalAmount)}
                </span>
              </h5>
              <hr />
              <table width="100%" className="mb-10 table table-striped">
                <thead>
                  <tr className="bg-gray-100 p-1">
                    <td className="font-bold">Name</td>
                    <td className="font-bold">Price</td>
                    <td className="font-bold">Quantity Sold</td>
                    <td className="font-bold">Amount</td>
                  </tr>
                </thead>
                {sales &&
                  sales.map((sale, i) => (
                    <>
                      {sale.products.map((product) => (
                        <tbody>
                          <tr>
                            <td>{product.name}</td>
                            <td>
                              {' '}
                              {FormatCurrency(Number(product.sellingPrice))}
                            </td>
                            <td> {product.count}</td>
                            <td>
                              {' '}
                              {FormatCurrency(
                                product.sellingPrice * product.count,
                              )}
                            </td>
                          </tr>
                        </tbody>
                      ))}
                    </>
                  ))}
              </table>
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
          </div>
        </Modal>
      </AdminRoute>
    </Layout>
  );
};

export default ManageDailySales;
