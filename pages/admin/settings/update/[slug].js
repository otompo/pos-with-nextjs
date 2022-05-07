import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Avatar, Button, Image, Spin } from 'antd';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/client';
import Layout from '../../../../components/layout/Layout';
import AdminRoute from '../../../../components/routes/AdminRoutes';
import { EditOutlined, UpCircleFilled } from '@ant-design/icons';
import axios from 'axios';

const Index = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [values, setValues] = useState({
    name: '',
    address: '',
    email: '',
    contactNumber: '',
    website: '',
    logoDefualt: '',
    description: {},
    logo: '',
    loading: false,
  });

  const [company, setCompany] = useState({});
  const [progress, setProgress] = useState(false);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(values.logo);
  const [uploadButtonText, setUploadButtonText] = useState('Upload Logo');
  const [imagePreview, setImagePreview] = useState('');
  const [name, setName] = useState('');

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    loadCompanyDetails();
  }, [slug]);

  const loadCompanyDetails = async () => {
    try {
      const { data } = await axios.get(`/api/admin/settings/update/${slug}`);
      setValues(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdateSubmit = async () => {
    try {
      const { data } = await axios.put(`/api/admin/settings/update/${slug}`, {
        name: values.name,
        address: values.address,
        contactNumber: values.contactNumber,
        email: values.email,
        website: values.website,
        description: values.description,
        image,
      });
      toast.success('success');
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdateImage = async () => {
    try {
      const { data } = await axios.put(`/api/admin/settings/update/${slug}`, {
        image,
      });
      toast.success('success');
    } catch (err) {
      console.log(err);
    }
  };

  const handleImage = async (e) => {
    e.preventDefault();
    let file = e.target.files[0];
    setUploadButtonText(file.name);
    setImagePreview(window.URL.createObjectURL(file));
    const imageData = new FormData();
    imageData.append('image', file);
    // resize image and send image to backend
    try {
      let { data } = await axios.post(`/api/upload/image`, imageData);
      // set image in the state
      setImage(data);
      setLoading(false);
      setUploadButtonText('Upload Logo');
      toast.success('Success');
    } catch (err) {
      console.log(err);
      setUploadButtonText('Upload Logo');
      setLoading(false);
    }
  };

  return (
    <Layout title="Edit  Details">
      <AdminRoute>
        <h1 className="lead">Edit Company Details</h1>
        <hr />
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-10">
              <div className="card">
                <div className="card-body">
                  <div className="container">
                    <div className="row">
                      <div className="col-md-3">
                        <h4>Name</h4>
                        <p>
                          {' '}
                          <input
                            type="text"
                            name="name"
                            className="form-control mb-4 p-2"
                            onChange={handleChange}
                            value={values.name}
                            placeholder="Enter name"
                          />
                        </p>
                      </div>
                      <div className="col-md-3">
                        <h4>Email</h4>
                        <p>
                          {' '}
                          <input
                            type="text"
                            name="email"
                            className="form-control mb-4 p-2"
                            onChange={handleChange}
                            value={values.email}
                            placeholder="Enter email"
                          />
                        </p>
                      </div>
                      <div className="col-md-3">
                        <h4>Website</h4>
                        <p>
                          <input
                            type="text"
                            name="website"
                            className="form-control mb-4 p-2"
                            onChange={handleChange}
                            value={values.website}
                            placeholder="Enter website url"
                          />
                        </p>
                      </div>
                      <div className="col-md-3">
                        {' '}
                        <h4>Contact</h4>
                        <p>
                          <input
                            type="text"
                            name="contactNumber"
                            className="form-control mb-4 p-2"
                            onChange={handleChange}
                            value={values.contactNumber}
                            placeholder="Enter contact number"
                          />
                        </p>
                      </div>
                      <div className="col-md-3">
                        <h4>Address</h4>
                        <p>
                          <input
                            type="text"
                            name="address"
                            className="form-control mb-4 p-2"
                            onChange={handleChange}
                            value={values.address}
                            placeholder="Enter address"
                          />
                        </p>
                      </div>
                      <div className="col-md-7 ">
                        <h4>Description</h4>
                        <p>
                          {' '}
                          <textarea
                            name="description"
                            cols="7"
                            rows="7"
                            value={values.description}
                            className="form-control"
                            onChange={handleChange}
                          ></textarea>
                        </p>
                      </div>

                      <div className="col-md-6 offset-md-4">
                        <Button
                          type="primary"
                          shape="round"
                          icon={<UpCircleFilled />}
                          size={150}
                          style={{
                            width: '100%',
                            height: '100%',
                            padding: '10px',
                          }}
                          onClick={handleUpdateSubmit}
                        >
                          UPDATE
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-2">
              <div className="col-md-2 my-3">
                {imagePreview ? (
                  <Avatar size={90} src={imagePreview} />
                ) : values.logo ? (
                  <Avatar size={90} src={values && values.logo} />
                ) : (
                  <Avatar size={90} src={values && values.logoDefualt} />
                )}
              </div>

              <div className="col-md-2 my-3">
                <label
                  className="btn btn-dark btn-block  text-center"
                  style={{ width: '460%' }}
                >
                  {loading ? (
                    <span className="spinLoader">
                      <Spin />
                    </span>
                  ) : (
                    `${uploadButtonText}`
                  )}

                  <input
                    type="file"
                    name="image"
                    size="large"
                    onChange={handleImage}
                    accept="image/*"
                    hidden
                  />
                </label>
              </div>
              {/* <div className="col-md-2 my-3">
                <Button
                  type="primary"
                  shape="round"
                  icon={<UpCircleFilled />}
                  size={150}

                  //   onClick={handleUpdateSubmit}
                >
                  SAVE IMAGE
                </Button>
              </div> */}
            </div>
          </div>
        </div>
      </AdminRoute>
    </Layout>
  );
};

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });

  if (!session || !session.user.role.includes('Admin')) {
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
export default Index;
