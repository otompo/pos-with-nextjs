import { Avatar } from 'antd';
import axios from 'axios';
import { MDBDataTable } from 'mdbreact';
import { getSession } from 'next-auth/client';
import React, { useEffect, useState } from 'react';
import FormatCurrency from '../../components/FormatCurrency';
import Layout from '../../components/layout/Layout';
import Loader from '../../components/layout/Loader';
import UserRoute from '../../components/routes/UserRoutes';

const Index = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    showSales();
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
          label: 'Grand Total',
          field: 'grandtotal',
          sort: 'asc',
        },
        {
          label: 'Payment Method',
          field: 'paymentMethod',
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
                  {FormatCurrency(product.sellingPrice)}{' '}
                  <h6 className="d-inline pl-2">Quantity:</h6> {product.count}
                  <br />
                </span>
              ))}
            </span>
          ),

          quantity: `${sale.quantitySold}`,
          grandtotal: `${FormatCurrency(sale.grandTotal)}`,
          paymentMethod: `${sale.paymentMethod}`,
        });
      });

    return data;
  };

  return (
    <Layout>
      <UserRoute>
        <h1 className="lead">MY Daily Sales</h1>
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
        {/* <pre>{JSON.stringify(sales, null, 4)}</pre> */}
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
