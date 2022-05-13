import { Avatar } from 'antd';
import axios from 'axios';
import { MDBDataTable } from 'mdbreact';
import { getSession } from 'next-auth/client';
import React, { useRef, useEffect, useState } from 'react';
import Layout from '../../../components/layout/Layout';
import Loader from '../../../components/layout/Loader';
import UserRoute from '../../../components/routes/UserRoutes';
import ReactToPrint from 'react-to-print';
import { Modal } from 'antd';
import { PrinterOutlined } from '@ant-design/icons';
import FormatCurrency from '../../../components/FormatCurrency';
import moment from 'moment';
const { confirm } = Modal;

const Index = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [tempData, setTempData] = useState([]);
  const [company, setCompany] = useState([]);

  const showPrintData = (sale) => {
    let tempData = [sale];
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

  useEffect(() => {
    showSales();
    loadComapny();
  }, []);

  const showSales = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/sales`);
      setSales(data.sales);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const loadComapny = async () => {
    try {
      // setLoading(true);
      const { data } = await axios.get(`/api/admin/settings`);
      setCompany(data);
      // setLoading(false);
    } catch (err) {
      console.log(err);
      // setLoading(false);
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
          label: 'Date Format: DD/MM/Y',
          field: 'date',
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
        {
          label: 'Action',
          field: 'action',
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
                  <h6 className="d-inline pl-4">Price:</h6> GH&#x20B5;
                  {product.discountPrice.toFixed(2)}{' '}
                  <h6 className="d-inline pl-2">Tax:</h6> GH&#x20B5;{' '}
                  {product.tax.toFixed(2)}{' '}
                  <h6 className="d-inline pl-2">Quantity:</h6> {product.count}
                  <br />
                </span>
              ))}
            </span>
          ),

          date: moment(sale.createdAt).format('DD/MM/Y'),
          subtotal: `${FormatCurrency(sale.subTotal)}`,
          totaltax: `${FormatCurrency(sale.totalTax)}`,
          grandtotal: `${FormatCurrency(sale.grandTotal)}`,
          action: (
            <>
              <button
                className="btn btn-danger mx-2"
                onClick={() => showPrintData(sale)}
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
    <Layout>
      <UserRoute>
        <h1 className="lead">Bills</h1>
        <hr />
        <div className="container">
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
              {company &&
                company.map((item) => (
                  <p className="c_logo" key={item._id}>
                    {item.logo ? (
                      <Avatar size={90} src={item && item.logo} />
                    ) : (
                      <Avatar size={90} src={item && item.logoDefualt} />
                    )}
                  </p>
                ))}
              <div className="container">
                <div className="row">
                  <div className="col-md-12">
                    {company &&
                      company.map((item) => (
                        <ul key={item.slug}>
                          <li>
                            <h2>{item.name}</h2>
                          </li>
                          <li>
                            <h6 className="d-inline">Email:</h6> {item.email}
                          </li>
                          <li>
                            <h6 className="d-inline">Website:</h6>{' '}
                            {item.website}
                          </li>
                          <li>
                            <h6 className="d-inline">Contact:</h6>{' '}
                            {item.contactNumber}
                          </li>
                          <li>
                            <h6 className="d-inline">Address:</h6>{' '}
                            {item.address}
                          </li>
                        </ul>
                      ))}
                  </div>
                </div>
              </div>
              <hr />
              <article className="mt-10 mb-14 flex items-end justify-end">
                {tempData.map((temp) => (
                  <ul key={temp._id}>
                    <li className="p-1 ">
                      <h6 className="d-inline">Receipt number:</h6> {temp._id}
                    </li>

                    <li className="p-1 bg-gray-100">
                      <h6 className="d-inline">Receipt date:</h6>{' '}
                      {moment(temp.createdAt).format('LL')}
                    </li>
                    <li className="p-1 bg-gray-100">
                      <h6 className="d-inline">Receipt issued by:</h6>{' '}
                      {temp.saler.name}
                    </li>
                  </ul>
                ))}
              </article>
              <hr />
              <table width="100%" className="mb-10 table table-striped">
                <thead>
                  <tr className="bg-gray-100 p-1">
                    <td className="font-bold">Image</td>
                    <td className="font-bold">Name</td>
                    <td className="font-bold">Price</td>
                    <td className="font-bold">Quantity</td>
                    <td className="font-bold">Tax</td>
                    <td className="font-bold">Total Fare</td>
                  </tr>
                </thead>
                {tempData &&
                  tempData.map((temp) =>
                    temp.products.map((product) => (
                      <tbody key={product._id}>
                        <tr className="h-10">
                          <td>
                            {' '}
                            <Avatar
                              size={30}
                              src={product && product.imagePath}
                            />
                          </td>
                          <td>{product.name}</td>
                          <td>GH&#x20B5; {product.discountPrice}.00</td>
                          <td>{product.count}</td>
                          <td>GH&#x20B5; {product.tax}.00</td>
                          <td>
                            GH&#x20B5;{' '}
                            {product.tax +
                              product.count * product.discountPrice}
                            .00
                          </td>
                        </tr>
                      </tbody>
                    )),
                  )}
              </table>
              {tempData &&
                tempData.map((temp) => (
                  <>
                    <div className="container" key={temp._id}>
                      <div className="row">
                        {/* <div className="col-md-6">Yaw</div> */}
                        <div className="col-md-6 ml-5">
                          <h6 className="d-inline pl-4"> TOTAL QUANTITY:</h6>{' '}
                          {temp.quantitySold}
                          <br />
                          <h6 className="d-inline pl-4"> SUB TOTAL:</h6>{' '}
                          GH&#x20B5; {temp.subTotal}.00
                          <br />
                          <h6 className="d-inline pl-4">
                            {' '}
                            TAX:
                          </h6> GH&#x20B5; {temp.totalTax}
                          <br />
                          <h6 className="d-inline pl-4"> GRAND TOTAL:</h6>{' '}
                          GH&#x20B5; {temp.grandTotal}.00
                          <br />
                          <h6 className="d-inline pl-4">
                            {' '}
                            PAYMENT METHOD:
                          </h6>{' '}
                          {temp.paymentMethod}
                        </div>
                      </div>
                    </div>
                  </>
                ))}
              <div className="container">
                <div className="row mt-3">
                  <div className="col-md-12 text-center">
                    Remarks:<h6>All amounts only keep two decimal places</h6>
                  </div>
                </div>
              </div>
              {company &&
                company.map((item) => (
                  <p className="descreption" key={item._id}>
                    <span className="lead" style={{ fontSize: '15px' }}>
                      {item.description}
                    </span>
                  </p>
                ))}
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
      </UserRoute>
    </Layout>
  );
};

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}

export default Index;
