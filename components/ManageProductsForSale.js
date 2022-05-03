import React, { useEffect, useState, useContext } from 'react';
import { MDBDataTable } from 'mdbreact';
import { Avatar, Badge, Button } from 'antd';
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
import { count } from '../backend/models/productModel';
import Cart from './Cart';
import { addToCart } from '../actions/Actions';
function ManageProductsForSale(props) {
  const { state, dispatch } = useContext(CartContext);
  const { cart } = state;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    showProducts();
  }, []);

  const showProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/products`);
      setProducts(data);
      setLoading(false);
    } catch (err) {
      console.log(err.response);
      toast.error(err.response.data.message);
      setLoading(false);
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
            <div className="col-md-6">
              <h1 className="lead">Sales</h1>
            </div>
            <div className="col-md-4 offset-md-2 float-right">
              <Link href="/user/cart">
                <a>
                  <Badge count={cart && cart.length ? cart.length : 0} showZero>
                    <ShoppingCartOutlined style={{ fontSize: '40px' }} />
                  </Badge>
                </a>
              </Link>
            </div>
          </div>
        </div>
        <hr />
        <div className="container-fluid">
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
      </UserRouter>
    </Layout>
  );
}

export default ManageProductsForSale;
