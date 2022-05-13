import React, { useRef, useEffect, useState } from 'react';
import { Modal, Avatar } from 'antd';
import {
  EditOutlined,
  PrinterOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import AdminRoute from '../routes/AdminRoutes';
import { MDBDataTable } from 'mdbreact';
import Layout from '../layout/Layout';
import moment from 'moment';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loader from '../layout/Loader';
import ReactToPrint from 'react-to-print';

const { confirm } = Modal;

const ManageProductsExpired = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
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

  useEffect(() => {
    loadProductsExpired();
  }, []);

  const loadProductsExpired = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/admin/products/expired`);
      setProducts(data.products);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const handleDelete = (index) => {
    confirm({
      title: `Are you sure delete`,
      icon: <ExclamationCircleOutlined />,
      content: 'It will be deleted permanentily if you click Yes',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',

      onOk: async () => {
        try {
          //   const answer = window.confirm('Are you sure you want to delete?');
          //   if (!answer) return;
          setLoading(true);
          let allProducts = products;
          const removed = allProducts.splice(index, 1);
          // console.log('removed', removed[0]._id);
          setProducts(allProducts);
          // send request to server
          const { data } = await axios.delete(
            `/api/admin/products/${removed[0]._id}`,
          );
          // console.log('LESSON DELETED =>', data);
          toast.success('Product Deleted Successfully');
          setLoading(false);
        } catch (err) {
          toast.error(err.response.data.message);
          setLoading(false);
        }
      },
      onCancel() {
        return;
      },
    });
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

        // {
        //   label: 'Action',
        //   field: 'action',
        //   sort: 'asc',
        // },
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
          price: `GH₵ ${Number(product.price).toFixed(2)}`,
          discountPrice: `GH₵ ${product.discountPrice.toFixed(2)}`,
          expireDate: `${moment(product.expireDate).fromNow()}`,
          discount: `${product.discount}`,
          tax: `${product.tax}`,
          createdat: `${moment(product.createdAt).fromNow()}`,

          // action: (
          //   <>
          //     <div className="container">
          //       <div className="row">
          //         <div className="col-md-8 offset-md-2">
          //           <span onClick={() => handleDelete(index)}>
          //             <DeleteOutlined
          //               className="text-danger d-flex justify-content-center"
          //               style={{ cursor: 'pointer', fontSize: 30 }}
          //             />
          //           </span>
          //         </div>
          //       </div>
          //     </div>
          //   </>
          // ),
        });
      });

    return data;
  };
  return (
    <Layout title="Manage Products Expired">
      <AdminRoute>
        <div className="row my-3">
          <div className="col-md-10">
            <h1 className="lead">Manage Products Expired</h1>
          </div>
          <div className="col-md-2">
            <button className="btn btn-danger mx-2" onClick={showPrintData}>
              <PrinterOutlined style={{ fontSize: 25 }} />
            </button>
          </div>
        </div>
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
          title="EXPIRED PRODUCTS"
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={null}
          width={700}
        >
          <div className="invoice__preview bg-white  rounded">
            <div ref={componentRef} className="p-5" id="invoice__preview">
              <h5>LIST OF EXPIRED PRODUCTS</h5>
              <hr />
              <table width="100%" className="mb-10 table table-striped">
                <thead>
                  <tr className="bg-gray-100 p-1">
                    <td className="font-bold">Image</td>
                    <td className="font-bold">Name</td>
                    <td className="font-bold">Expired Date</td>
                    <td className="font-bold">Category</td>
                  </tr>
                </thead>
                {products.map((product) => (
                  <tbody key={product._id}>
                    <tr className="h-10">
                      <td>
                        {' '}
                        <Avatar size={30} src={product && product.imagePath} />
                      </td>
                      <td>{product.name}</td>
                      <td>{moment(product.expireDate).fromNow()}</td>
                      <td>
                        {product.category &&
                          product.category.map((c, i) => (
                            <span key={i}>{c.name}</span>
                          ))}
                      </td>
                    </tr>
                  </tbody>
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
        {/* <pre>{JSON.stringify(products, null, 4)}</pre> */}
      </AdminRoute>
    </Layout>
  );
};

export default ManageProductsExpired;
