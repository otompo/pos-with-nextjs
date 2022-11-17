import { useEffect, useState } from 'react';
import { getSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { Badge, Avatar, Card } from 'antd';
import moment from 'moment';
import axios from 'axios';
import Layout from '../../../components/layout/Layout';
import AdminRoute from '../../../components/routes/AdminRoutes';

const UserProfilePage = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [loading, setLoading] = useState('');
  const [featurePrice, setFeaturePrice] = useState({});

  useEffect(() => {
    loadFeatureprice();
  }, [slug]);

  const loadFeatureprice = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/admin/featureprice/view/${slug}`);
      // console.log(data);
      setFeaturePrice(data);
      setLoading(false);
    } catch (err) {
      console.log(err.response.data.message);
      toast.error(err.response.data.message);
      setLoading(false);
    }
  };

  return (
    <Layout title={featurePrice && featurePrice.title}>
      <AdminRoute>
        <div>
          <h1 className="lead"> Feature Price Details</h1>
          <hr />
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-8 offset-md-2">
                <Card
                  title={
                    <>
                      <span style={{ fontWeight: 'bold', fontSize: 25 }}>
                        {featurePrice && featurePrice.title}
                      </span>
                    </>
                  }
                  extra={
                    <>
                      <span style={{ fontWeight: 'bold' }}>
                        Created At: {moment(featurePrice.createdAt).fromNow()}
                      </span>
                      <br />
                      <span style={{ fontWeight: 'bold', color: '#f58220' }}>
                        Category:{' '}
                        {featurePrice &&
                          featurePrice.category &&
                          featurePrice.category.map((c, i) => (
                            <span>{c.name}</span>
                          ))}
                      </span>
                      <br />
                      <span style={{ fontWeight: 'bold', color: '#f58220' }}>
                        Price: GHS {featurePrice && featurePrice.price}.00
                      </span>
                    </>
                  }
                  //   style={{ width: 300 }}
                >
                  <p>
                    {featurePrice &&
                      featurePrice.features &&
                      featurePrice.features.map((feature, i) => (
                        <ul key={i} className="list-group">
                          <li className="list-group-item d-flex justify-content-between align-items-center">
                            {feature.name}
                            <span>
                              <Avatar
                                shape="circle"
                                size="small"
                                icon={i + 1}
                              />
                            </span>
                          </li>
                        </ul>
                      ))}
                  </p>
                </Card>
              </div>
            </div>
          </div>
          {/* <pre>{JSON.stringify(featurePrice, null, 4)}</pre> */}
        </div>
      </AdminRoute>
    </Layout>
  );
};

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });

  if (!session || !session.user.role.includes('admin')) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}

export default UserProfilePage;
