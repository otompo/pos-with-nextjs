import React, { useRef, useEffect, useState, useContext } from 'react';
import { MDBDataTable } from 'mdbreact';
import { Avatar, Badge, Button, Modal, Spin } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import UserRouter from './routes/UserRoutes';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import 'react-datepicker/dist/react-datepicker.css';
import Loader from './layout/Loader';
import Layout from './layout/Layout';
import QRCode from 'react-qr-code';
import ReactToPrint from 'react-to-print';
import { CartContext } from '../context/cartContext';
import Cart from './Cart';
import { addToCart } from '../actions/Actions';
import FormatCurrency from './FormatCurrency';
import { PrinterOutlined } from '@ant-design/icons';
import moment from 'moment';
import useSettings from '../hooks/useSettings';
import renderHTML from 'react-render-html';

const { confirm } = Modal;

function ManageProductsForSale(props) {
  const [actionTriggered, setActionTriggered] = useState('');
  const { state, dispatch } = useContext(CartContext);
  const { cart } = state;
  const [subTotal, setSubTotal] = useState(0);
  const [products, setProducts] = useState([]);
  const [quantitySold, setQuantitySold] = useState('');
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState(false);
  const [success, setSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [paidAmount, setPaidAmount] = useState(0);
  const [grandTotal, setGandTotal] = useState(0);
  const [sales, setSales] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const {
    name,
    address,
    email,
    contactNumber,
    website,
    companyLogo,
    description,
  } = useSettings();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    const getSubTotal = () => {
      const res = cart.reduce((prev, item) => {
        return prev + item.sellingPrice * item.count;
      }, 0);

      setSubTotal(res);
    };

    // const getTaxTotal = () => {
    //   const res = cart.reduce((prev, item) => {
    //     return prev + item.tax * item.count;
    //   }, 0);

    //   setTotalTax(res);
    // };

    const getQuantitySold = () => {
      const res = cart.reduce((prev, item) => {
        return prev + item.count;
      }, 0);

      setQuantitySold(res);
    };

    getSubTotal();
    getQuantitySold();
  }, [cart]);

  useEffect(() => {
    setGandTotal(subTotal);
  }, [subTotal]);

  useEffect(() => {
    showProducts();
    showSales();
  }, [success]);

  const componentRef = useRef();

  const handlePrint = () => {
    window.print();
  };

  const showSales = async () => {
    try {
      setLoading(true);
      setOk(true);
      const { data } = await axios.get(`/api/sales/limit`);
      setSales(data);
      setLoading(false);
      setOk(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
      setOk(false);
    }
  };

  const showProducts = async () => {
    try {
      setLoading(true);
      setOk(true);
      const { data } = await axios.get(`/api/products`);
      setProducts(data.products);
      setLoading(false);
      setOk(false);
    } catch (err) {
      console.log(err.response);

      setLoading(false);
      setOk(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setSuccess(true);
      const { data } = await axios.post(`/api/sales`, {
        cart,
        subTotal,
        paymentMethod,
        quantitySold,
        paidAmount,
        grandTotal,
      });
      setLoading(false);
      setSuccess(false);
      setPaidAmount(0);
      setIsModalVisible(false);
      dispatch({ type: 'ADD_CART', payload: [] });
      toast.success('Success Print reciet');
    } catch (err) {
      console.log(err.response);
      setLoading(false);
      setSuccess(false);
    }
  };

  const setData = () => {
    const data = {
      columns: [
        {
          label: 'Name',
          field: 'name',
          sort: 'asc',
        },
        {
          label: 'Quantity',
          field: 'quantity',
          sort: 'asc',
        },

        {
          label: 'Price',
          field: 'price',
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

    products &&
      products.forEach((product, index) => {
        data.rows.push({
          name: `${product.name}`,
          quantity: `${product.quantity}`,
          price: `${FormatCurrency(product.sellingPrice)}`,

          action: (
            <>
              <div className="container">
                <div className="row">
                  <div className="col-md-2">
                    <Button
                      type="primary"
                      shape="round"
                      size={20}
                      disabled={product.quantity === 0}
                      // onClick={() => addToCart(product, cart)}
                      onClick={() => dispatch(addToCart(product, cart))}
                    >
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            </>
          ),
        });
      });

    return data;
  };

  return (
    <Layout title="Dashboard">
      <UserRouter>
        <div className="container">
          <div className="row my-3">
            <div className="col-md-2 offset-md-4">
              {/* <Link href="/user/cart">
                <a> */}
              <Badge count={cart && cart.length ? cart.length : 0} showZero>
                <ShoppingCartOutlined style={{ fontSize: '40px' }} />
              </Badge>
              {/* </a>
              </Link> */}
            </div>

            <div className="col-md-6">
              <button
                className="btn btn-dark mx-5"
                onClick={() => {
                  setIsModalVisible(true);
                  setActionTriggered('ACTION_1');
                }}
                disabled={cart.length === 0}
              >
                Proceed with payment
              </button>
              <button
                // disabled={cart.length === 0}
                className="btn btn-danger mx-2"
                onClick={() => {
                  setIsModalVisible(true);
                  setActionTriggered('ACTION_2');
                }}
              >
                <PrinterOutlined style={{ fontSize: 25 }} />
              </button>
            </div>
          </div>
        </div>
        <hr />
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-7">
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
            <div className="col-md-5">
              {/* <div className="row">
                <div className="col-md-12 ">
                  <h4 className="d-inline">SUBTOTAL:</h4>
                  <h4 className="d-inline" style={{ color: '#e35102' }}>
                    {FormatCurrency(Number(subTotal))}
                  </h4>
                </div>
              </div> */}

              <div className="row">
                <div className="col-md-12 ">
                  <h4 className="d-inline">GRAND TOTAL:</h4>
                  <h4 className="d-inline" style={{ color: '#e35102' }}>
                    {FormatCurrency(grandTotal)}
                  </h4>
                </div>
              </div>
              <hr />
              {cart.map((item) => (
                <Cart
                  key={item._id}
                  item={item}
                  dispatch={dispatch}
                  cart={cart}
                />
              ))}
            </div>
          </div>
        </div>
      </UserRouter>
      <Modal
        title={
          actionTriggered == 'ACTION_1' ? (
            <span>Payment Summary</span>
          ) : (
            <span>Receipt</span>
          )
        }
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        width={700}
      >
        {actionTriggered == 'ACTION_1' ? (
          <div className="container">
            <div className="row">
              <div className="col-md-5">
                <h1 className="lead">Sales Summary</h1>
                <hr />
                {cart.map((item, i) => (
                  <div className="row" key={i}>
                    <div className="col-md-12">
                      <h6>{item.name}</h6>
                      <p>
                        Amount: {item.count} X GH&#x20B5;{item.sellingPrice}=
                        GH&#x20B5;
                        {FormatCurrency(item.count * item.sellingPrice)}
                        <br />
                        Quantity: {item.count}
                      </p>
                      <hr />
                    </div>
                  </div>
                ))}
              </div>
              <div className="col-md-7">
                <h1 className="lead">Form</h1>
                <hr />
                <form onSubmit={handleSubmit}>
                  <div className="form-group my-3">
                    <label htmlFor="name_field">Paid Amount</label>
                    <input
                      type="text"
                      className="form-control"
                      value={paidAmount}
                      onChange={(e) => setPaidAmount(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="category_field">Payment Method</label>
                    <select
                      className="form-control"
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                      {['Cash', 'MobileMoney', 'Gift'].map((paymentMethod) => (
                        <option
                          key={paymentMethod}
                          value={paymentMethod}
                          className="py-5"
                        >
                          {paymentMethod}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    className="btn btn-primary block my-3"
                    disabled={!paidAmount || ok}
                    type="submit"
                    style={{ width: '100%' }}
                  >
                    {ok ? <Spin /> : 'Proceed'}
                  </button>
                </form>
                <hr />
                <div className="row my-4">
                  <div className="col-md-12">
                    <h5 className="d-inline">Amount To Pay:</h5>
                    <h5 className="d-inline"> {FormatCurrency(grandTotal)}</h5>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <h5 className="d-inline">Balance:</h5>
                    <h5 className="d-inline">
                      {' '}
                      {paidAmount < grandTotal
                        ? `Input Paid Amount`
                        : ` ${FormatCurrency(paidAmount - grandTotal)}`}
                    </h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : actionTriggered == 'ACTION_2' ? (
          <div className="invoice__preview bg-white  rounded">
            <div ref={componentRef} className="p-5" id="invoice__preview">
              {/* {company &&
                company.map((item) => (
                  <p className="c_logo" key={item._id}>
                    {item.logo ? (
                      <Avatar size={90} src={item && item.logo} />
                    ) : (
                      <Avatar size={90} src={item && item.logoDefualt} />
                    )}
                  </p>
                ))} */}

              <div className="container">
                <div className="row">
                  <div className="col-md-7">
                    <ul>
                      <li>
                        <h2>{name}</h2>
                      </li>
                      <li>
                        <h6 className="d-inline">Email:</h6> {email}
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
              <article className="mt-10 mb-14 flex items-end justify-end">
                {sales.map((item, i) => (
                  <ul key={i}>
                    <li className="p-1 ">
                      <h6 className="d-inline">Receipt number:</h6> {item._id}
                    </li>

                    <li className="p-1 bg-gray-100">
                      <h6 className="d-inline">Receipt date:</h6>{' '}
                      {moment(item.createdAt).format('LL')}
                    </li>
                    <li className="p-1 bg-gray-100">
                      <h6 className="d-inline">Receipt issued by:</h6>{' '}
                      {item.saler.name}
                    </li>
                  </ul>
                ))}
              </article>
              {/* <pre>{JSON.stringify(sales, null, 4)}</pre> */}
              <hr />
              <table width="100%" className="mb-10 table table-striped">
                <thead>
                  <tr className="bg-gray-100 p-1">
                    <td className="font-bold">Name</td>
                    <td className="font-bold">Price</td>
                    <td className="font-bold">Quantity</td>
                    <td className="font-bold">Total</td>
                  </tr>
                </thead>

                {sales &&
                  sales.map((item) =>
                    item.products.map((product) => (
                      <tbody key={product._id}>
                        <tr className="h-10">
                          <td>{product.name}</td>
                          <td>GH&#x20B5; {product.sellingPrice.toFixed(2)}</td>
                          <td>{product.count}</td>
                          <td>
                            GH&#x20B5;{' '}
                            {(product.count * product.sellingPrice).toFixed(2)}
                          </td>
                        </tr>
                      </tbody>
                    )),
                  )}
              </table>
              {sales &&
                sales.map((item) => (
                  <>
                    <div className="container" key={item._id}>
                      <div className="row">
                        {/* <div className="col-md-6">Yaw</div> */}
                        <div className="col-md-6 ml-5">
                          <h6 className="d-inline pl-4"> TOTAL QUANTITY:</h6>{' '}
                          {item.quantitySold}
                          <br />
                          {/* <h6 className="d-inline pl-4"> SUB TOTAL:</h6>{' '}
                          GH&#x20B5; {item.subTotal}
                          <br /> */}
                          <h6 className="d-inline pl-4"> GRAND TOTAL:</h6>{' '}
                          {FormatCurrency(item.grandTotal)}
                          <br />
                          <h6 className="d-inline pl-4">
                            {' '}
                            PAYMENT METHOD:
                          </h6>{' '}
                          {item.paymentMethod}
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
              <p className="descreption">
                <span className="lead" style={{ fontSize: '15px' }}>
                  {renderHTML(description)}
                </span>
              </p>
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
        ) : null}
      </Modal>
    </Layout>
  );
}

export default ManageProductsForSale;
