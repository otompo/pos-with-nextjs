import React, { useEffect, useState, useContext } from 'react';
import { MDBDataTable } from 'mdbreact';
import { Avatar, Badge, Button, Modal, Spin } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import UserRouter from './routes/UserRoutes';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-datepicker/dist/react-datepicker.css';
import Loader from './layout/Loader';
import Layout from './layout/Layout';
import QRCode from 'react-qr-code';
import Link from 'next/link';
import { CartContext } from '../context/cartContext';
import Cart from './Cart';
import { addToCart } from '../actions/Actions';

const { confirm } = Modal;

function ManageProductsForSale(props) {
  const { state, dispatch } = useContext(CartContext);
  const { cart } = state;
  const [subTotal, setSubTotal] = useState(0);
  const [totalTax, setTotalTax] = useState(0);
  const [products, setProducts] = useState([]);
  const [quantitySold, setQuantitySold] = useState('');
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState(false);
  const [success, setSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [paidAmount, setPaidAmount] = useState(0);
  const [grandTotal, setgGandTotal] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);

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
        return prev + item.discountPrice * item.count;
      }, 0);

      setSubTotal(res);
    };

    const getTaxTotal = () => {
      const res = cart.reduce((prev, item) => {
        return prev + item.tax;
      }, 0);

      setTotalTax(res);
    };
    const getQuantitySold = () => {
      const res = cart.reduce((prev, item) => {
        return prev + item.count;
      }, 0);

      setQuantitySold(res);
    };

    getSubTotal();
    getTaxTotal();
    getQuantitySold();
  }, [cart]);

  useEffect(() => {
    setgGandTotal(subTotal + totalTax);
  }, [subTotal, totalTax]);

  useEffect(() => {
    showProducts();
  }, [success]);

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
      toast.error(err.response.data.message);
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
        totalTax,
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
          label: 'Image',
          field: 'image',
          sort: 'asc',
        },
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

        // {
        //   label: 'Scan',
        //   field: 'scan',
        //   sort: 'asc',
        // },
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
          image: <Avatar size={30} src={product && product.imagePath} />,
          name: `${product.name}`,
          quantity: `${product.quantity}`,
          // price: `GHS ${
          //   product.discount ? product.discountPrice : product.price
          // }.00`,
          price: `GHS ${product.discountPrice}.00`,

          // scan: (
          //   <QRCode
          //     value={product.batchId}
          //     style={{ width: '150px', height: '150px' }}
          //   />
          // ),
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
            <div className="col-md-2">
              <h2>POS</h2>
            </div>
            <div className="col-md-4 offset-md-2 float-right">
              {/* <Link href="/user/cart">
                <a> */}
              <Badge count={cart && cart.length ? cart.length : 0} showZero>
                <ShoppingCartOutlined style={{ fontSize: '40px' }} />
              </Badge>
              {/* </a>
              </Link> */}
            </div>

            <div className="col-md-4 float-right">
              <button
                className="btn btn-dark"
                onClick={showModal}
                disabled={cart.length === 0}
              >
                Proceed with payment
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
              <div className="row">
                <div className="col-md-12 ">
                  <h4 className="d-inline">SUBTOTAL:</h4>
                  <h4 className="d-inline" style={{ color: '#e35102' }}>
                    GH&#x20B5; {subTotal}.00
                  </h4>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <h4 className="d-inline">TAX:</h4>
                  <h4 className="d-inline" style={{ color: '#e35102' }}>
                    GH&#x20B5; {totalTax}.00
                  </h4>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12 ">
                  <h4 className="d-inline">GRAND TOTAL:</h4>
                  <h4 className="d-inline" style={{ color: '#e35102' }}>
                    GH&#x20B5; {subTotal + totalTax}.00
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

              {/* <pre>{JSON.stringify(cartItems, null, 4)}</pre> */}
            </div>
          </div>
        </div>
      </UserRouter>
      <Modal
        title="Payment Summary"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        width={700}
      >
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
                      Amount: {item.count} X GH&#x20B5;{item.discountPrice}=
                      GH&#x20B5;
                      {item.count * item.discountPrice}
                      <br />
                      Quantity: {item.count}
                      <br />
                      Tax: {item.tax}
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
                    {['Cash', 'MobileMoney'].map((paymentMethod) => (
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
                  <h5 className="d-inline"> GH&#x20B5; {grandTotal}.00</h5>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <h5 className="d-inline">Balance:</h5>
                  <h5 className="d-inline">
                    {' '}
                    {paidAmount < grandTotal
                      ? `Input Paid Amount`
                      : `${(paidAmount - grandTotal).toFixed(2)}.00`}
                  </h5>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </Layout>
  );
}

export default ManageProductsForSale;
