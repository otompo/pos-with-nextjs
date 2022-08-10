import React, { useEffect, useState } from 'react';
import { Spin, Modal, Avatar, Image } from 'antd';
import AdminRoute from '../routes/AdminRoutes';
import { MDBDataTable } from 'mdbreact';
import Layout from '../layout/Layout';
import moment from 'moment';
import TextTruncate from 'react-text-truncate';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Resizer from 'react-image-file-resizer';
import Loader from '../layout/Loader';
import FormatCurrency from '../FormatCurrency';

const { confirm } = Modal;

const ManageProductsAboutToExpire = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    loadProductsAboutToExpire();
  }, []);

  const loadProductsAboutToExpire = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `/api/admin/products/productsabouttoexpired`,
      );
      setProducts(data.products);
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
          label: 'Cost Price',
          field: 'costPrice',
          sort: 'asc',
        },
        {
          label: 'Selling Price',
          field: 'sellingPrice',
          sort: 'asc',
        },
        {
          label: 'Expire Date',
          field: 'expireDate',
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
          name: `${product.name}`,
          category: `${
            product &&
            product.category &&
            product.category.map((c, i) => `${c && c.name}`)
          }`,
          quantity: `${product.quantity}`,
          costPrice: `${FormatCurrency(Number(product.costPrice))}`,
          sellingPrice: `${FormatCurrency(Number(product.sellingPrice))}`,
          expireDate: `${moment(product.expireDate).fromNow()}`,
          createdat: `${moment(product.createdAt).fromNow()}`,

          // action: (
          //   <>
          //     <div className="container">
          //       <div className="row">
          //         <div className="col-md-8 offset-md-2">
          //           <span
          //             onClick={() => handleDelete(index)}
          //             // className="pt-1 pl-3"
          //           >
          //             <EditOutlined
          //               className="text-success d-flex justify-content-center"
          //               style={{ cursor: 'pointer', fontSize: 30 }}
          //             />
          //           </span>
          //         </div>
          //         {/* <div className="col-md-6">
          //           <span
          //             onClick={() => handleDelete(index)}

          //           >
          //             <DeleteOutlined
          //               className="text-danger d-flex justify-content-center"
          //               style={{ cursor: 'pointer', fontSize: 20 }}
          //             />
          //           </span>
          //         </div> */}
          //       </div>
          //     </div>
          //   </>
          // ),
        });
      });

    return data;
  };
  return (
    <Layout title="Manage Products About To Expire">
      <AdminRoute>
        <h1 className="lead">Manage Products About To Expire</h1>
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
        {/* <pre>{JSON.stringify(products, null, 4)}</pre> */}
      </AdminRoute>
    </Layout>
  );
};

export default ManageProductsAboutToExpire;
