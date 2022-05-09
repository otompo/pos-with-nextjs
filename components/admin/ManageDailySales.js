import React, { useEffect, useState } from 'react';
import AdminRoute from '../routes/AdminRoutes';
import Layout from '../layout/Layout';
import moment from 'moment';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loader from '../layout/Loader';
import { Button, Modal, Spin, Avatar, Badge } from 'antd';
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
  const [totalSales, setTotalSales] = useState('');

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
      setTotalSales(data.total);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };
  const setData = () => {
    const data = {
      columns: [
        // {
        //   label: 'Image',
        //   field: 'image',
        //   sort: 'asc',
        // },
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

        // {
        //   label: 'Price',
        //   field: 'price',
        //   sort: 'asc',
        // },

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
          // image: <Avatar size={30} src={product && product.imagePath} />,
          productsname: (
            <span>
              {sale.products.map((product) => (
                <span key={product._id}>
                  <h6 style={{ color: '#e74c3c' }}>{product.name}</h6>
                  <h6 className="d-inline pl-4">Price:</h6> GH&#x20B5;
                  {product.discountPrice.toFixed(2)}{' '}
                  <h6 className="d-inline pl-2">Tax:</h6> GH&#x20B5;{' '}
                  {product.tax}.00 <h6 className="d-inline pl-2">Quantity:</h6>{' '}
                  {product.count}
                  <br />
                </span>
              ))}
            </span>
          ),

          quantity: `${sale.quantitySold}`,
          subtotal: `${FormatCurrency(sale.subTotal)}`,
          totaltax: `${FormatCurrency(sale.totalTax)}`,
          grandtotal: `${FormatCurrency(sale.grandTotal)}`,
        });
      });

    return data;
  };
  return (
    <Layout title="Manage Daily Sales">
      <AdminRoute>
        <h1 className="lead">Manage Daily Sales</h1>
        <hr />

        <div className="row">
          <div className="col-md-8 offset-md-2 text-center">
            <h4 className="lead">
              SELECT START AND END DATE FOR SALES IN A DAY
            </h4>
            <div className="row mt-5">
              <div className="col-md-5">
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
              <div className="col-md-3">
                <Button
                  shape="round"
                  type="primary"
                  onClick={handleSalesSubmit}
                >
                  Submit
                </Button>
              </div>
              <div className="col-md-4">
                <h6 className="d-inline mr-2 text-uppercase">
                  Number of Sales
                </h6>{' '}
                <Avatar size={50} style={{ backgroundColor: '#87d068' }}>
                  {/* <Badge count={totalSales && totalSales} showZero /> */}
                  {totalSales && totalSales}
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
        {/* <pre>{JSON.stringify(totalSales, null, 4)}</pre>
        <pre>{JSON.stringify(sales, null, 4)}</pre> */}
      </AdminRoute>
    </Layout>
  );
};

export default ManageDailySales;
