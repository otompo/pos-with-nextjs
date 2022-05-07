import React, { useEffect, useState } from 'react';
import { Avatar, Button } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import AdminRoute from '../routes/AdminRoutes';
import Layout from '../layout/Layout';
import Loader from '../layout/Loader';
import axios from 'axios';
import Link from 'next/link';

const ManageSettings = () => {
  const [loading, setLoading] = useState(false);
  const [company, setCompany] = useState([]);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/admin/settings`);
      setCompany(data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  return (
    <Layout title="Manage Messages">
      <AdminRoute>
        <h1 className="lead">Company Details</h1>
        <hr />
        {loading ? (
          <Loader />
        ) : (
          <div className="card">
            <div className="card-body">
              <div className="container">
                {company &&
                  company.map((item) => (
                    <>
                      <div className="row" key={item._id}>
                        <div className="col-md-3">
                          <h4>Name</h4>
                          <p>{item.name}</p>
                        </div>
                        <div className="col-md-3">
                          <h4>Email</h4>
                          <p>{item.email}</p>
                        </div>
                        <div className="col-md-3">
                          <h4>Website</h4>
                          <p>{item.website}</p>
                        </div>
                        <div className="col-md-3">
                          {' '}
                          <h4>Contact</h4>
                          <p>{item.contactNumber}</p>
                        </div>
                        <div className="col-md-3">
                          <h4>Address</h4>
                          <p>{item.address}</p>
                        </div>
                        <div className="col-md-5">
                          <h4>Description</h4>
                          <p>{item.description}</p>
                        </div>
                        <div className="col-md-2 my-3">
                          {/* <Avatar
                            size={90}
                            src={
                              <Image
                                src={item.logo}
                                alt="Image"
                                preview={false}
                              />
                            }
                          /> */}
                          ,
                          {item.logo ? (
                            <Avatar size={90} src={item && item.logo} />
                          ) : (
                            <Avatar size={90} src={item && item.logoDefualt} />
                          )}
                        </div>
                        <div className="col-md-2">
                          <h4>Edit</h4>
                          <Link href={`/admin/settings/update/${item.slug}`}>
                            <a>
                              <Button
                                type="primary"
                                icon={<EditOutlined />}
                                size={40}
                              />
                            </a>
                          </Link>
                        </div>
                      </div>
                    </>
                  ))}
              </div>
            </div>
          </div>
        )}
      </AdminRoute>
    </Layout>
  );
};

export default ManageSettings;
