import React, { useEffect, useState } from 'react';
import { Spin, Modal, Avatar, Image } from 'antd';
import { RedoOutlined, DeleteOutlined, SyncOutlined } from '@ant-design/icons';
import AdminRoute from '../routes/AdminRoutes';
import { MDBDataTable } from 'mdbreact';
import Layout from '../layout/Layout';
import moment from 'moment';
import TextTruncate from 'react-text-truncate';
import axios from 'axios';
import { toast } from 'react-toastify';
import Resizer from 'react-image-file-resizer';
import Loader from '../layout/Loader';
import { useRouter } from 'next/router';
import Link from 'next/link';
import FormatCurrency from '../FormatCurrency';

const { confirm } = Modal;

const ManageProductsOutOfStock = () => {
  // const router = useRouter();
  // const { slug } = router.query;

  // const [values, setValues] = useState({
  //   quantity: '',
  // });

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [tempData, setTempData] = useState([]);
  const [quantity, setQuantity] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    loadProductsOutOfStock();
  }, [success]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // const handleChange = (e) => {
  //   setValues({ ...values, [e.target.name]: e.target.value });
  // };

  const loadModalData = (name, slug, quantity) => {
    let tempData = [name, quantity, slug];
    setTempData((item) => [...tempData]);

    // console.log(tempData);
    return showModal();
  };

  const loadProductsOutOfStock = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/admin/products/outofstock`);
      setProducts(data.products);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  let currentQty = tempData[1];
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSuccess(true);
      const { data } = await axios.put(
        `/api/admin/products/outofstock/update/${tempData[2]}`,
        {
          quantity,
          currentQty,
        },
      );
      toast.success('Success');
      setQuantity('');
      setSuccess(false);
      setIsModalVisible(false);
    } catch (err) {
      toast.error(err.response.data);
      setSuccess(false);
      setQuantity('');
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
          label: 'Category',
          field: 'category',
          sort: 'asc',
        },
        {
          label: 'Quantity',
          field: 'quantity',
          sort: 'asc',
        },
        {
          label: 'Unit Price',
          field: 'price',
          sort: 'asc',
        },
        {
          label: 'Discount Price',
          field: 'discountPrice',
          sort: 'asc',
        },
        {
          label: 'Expire Date',
          field: 'expireDate',
          sort: 'asc',
        },
        {
          label: 'Discount',
          field: 'discount',
          sort: 'asc',
        },
        {
          label: 'Tax',
          field: 'tax',
          sort: 'asc',
        },
        {
          label: 'Created At',
          field: 'createdat',
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
          image: <Avatar size={30} src={product && product.imagePath} />,
          name: `${product.name}`,
          category: `${
            product &&
            product.category &&
            product.category.map((c, i) => `${c && c.name}`)
          }`,
          quantity: `${product.quantity}`,
          price: `${FormatCurrency(Number(product.price))}`,
          discountPrice: `${FormatCurrency(product.discountPrice)}`,
          expireDate: `${moment(product.expireDate).fromNow()}`,
          discount: `${product.discount}`,
          tax: `${product.tax}`,
          createdat: `${moment(product.createdAt).fromNow()}`,

          action: (
            <>
              <div className="container">
                <div className="row">
                  <div className="col-md-8 offset-md-2">
                    <span
                      onClick={() =>
                        loadModalData(
                          product.name,
                          product.slug,
                          product.quantity,
                        )
                      }
                      className="pt-1 pl-3"
                    >
                      {/* <Link></Link> */}
                      <RedoOutlined
                        className="text-primary d-flex justify-content-center"
                        style={{ cursor: 'pointer', fontSize: 25 }}
                      />
                    </span>
                  </div>
                  {/* <div className="col-md-6">
                    <span
                      onClick={() => handleDelete(index)}
                    
                    >
                      <DeleteOutlined
                        className="text-danger d-flex justify-content-center"
                        style={{ cursor: 'pointer', fontSize: 20 }}
                      />
                    </span>
                  </div> */}
                </div>
              </div>
            </>
          ),
        });
      });

    return data;
  };
  return (
    <Layout title="Manage Products Out Of Stock">
      <AdminRoute>
        <h1 className="lead">Manage Products Out Of Stock</h1>
        <hr />
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
        <Modal
          title={`Update ${tempData[0]} Quantity`}
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={null}
          // width={300}
        >
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="number"
                // name="quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="form-control mb-4 p-2"
                placeholder="Enter quantity"
                required
              />
            </div>

            <div className="d-grid gap-2 my-2 ">
              <button
                className="btn btn-primary"
                // disabled={!values.name || loading}
                type="submit"
              >
                {/* {ok ? <SyncOutlined spin /> : 'Submit'} */}
                Update
              </button>
            </div>
          </form>
          {/* <pre>{JSON.stringify(tempData, null, 4)}</pre> */}
        </Modal>
        {/* <pre>{JSON.stringify(products, null, 4)}</pre> */}
      </AdminRoute>
    </Layout>
  );
};

export default ManageProductsOutOfStock;
