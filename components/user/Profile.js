import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { SyncOutlined } from '@ant-design/icons';
import { toast } from 'react-hot-toast';
import { Avatar, Badge, Button, Image, Spin } from 'antd';
import UserRoute from '../routes/UserRoutes';
import Resizer from 'react-image-file-resizer';
import Layout from '../layout/Layout';
import Loader from '../layout/Loader';
import { Context } from '../../context';

const UserProfilePage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [values, setValues] = useState({
    name: '',
    username: '',
    email: '',
    loading: false,
  });

  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState(false);

  const [passwordCurrent, setPasswordCurrent] = useState('');
  const [password, setPassword] = useState('');

  const {
    state: { user },
    dispatch,
  } = useContext(Context);

  useEffect(() => {
    loadUser();
  }, [id, success]);

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const loadUser = async () => {
    try {
      setOk(true);
      const { data } = await axios.get(`/api/user/profile`);
      setValues(data);
      setOk(false);
    } catch (err) {
      console.log(err);
      setOk(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setValues({ ...values, loading: true });
      const { data } = await axios.put(`/api/user/update`, {
        ...values,
      });

      const as = JSON.parse(await window.localStorage.getItem('user'));
      as.user = data;
      // console.log(as.user);
      dispatch({
        type: 'UPDATE_SUCCESS',
        payload: as.user,
      });

      toast.success('Success');
      setValues({ ...values, loading: false });
      //   updateUser(data);
    } catch (err) {
      toast.error(err.response.data.message);
      setValues({ ...values, loading: false });
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.patch(`/api/user/updatepassword`, {
        passwordCurrent,
        password,
      });
      setPassword('');
      setPasswordCurrent('');
      toast.success('Password pdated successfully');
      setLoading(false);
    } catch (err) {
      toast.error(err.response.data.message);
      setLoading(false);
    }
  };

  const TopInfo = () => {
    return (
      <div className="container-fluid mb-5 mt-3">
        <div className="row">
          <div className="col-md-8">
            <h1 className="lead mx-5">{values && values.name} Profile</h1>
          </div>
          <div className="col-md-4"></div>
        </div>
        <hr />
      </div>
    );
  };

  return (
    <Layout title={values.name && values.name}>
      <UserRoute>
        <div>
          {TopInfo()}
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-4">
                <div className="card">
                  <div className="card-body">
                    <div className="card-title">
                      <h6 className="text-uppercase">Update Profile</h6>
                    </div>
                    <form onSubmit={handleSubmit}>
                      <div className="form-group">
                        {' '}
                        <input
                          type="text"
                          name="name"
                          className="form-control mb-4 p-2"
                          onChange={handleChange}
                          value={values.name}
                          placeholder="Enter name"
                        />
                      </div>
                      <div className="form-group">
                        <input
                          name="email"
                          type="email"
                          className="form-control mb-4 p-2"
                          value={values.email}
                          onChange={handleChange}
                          placeholder="Enter email"
                        />
                      </div>

                      <div className="d-grid gap-2 my-2">
                        <button
                          // disabled={values.loading}
                          className="btn btn-primary"
                          type="submit"
                        >
                          {values.loading ? (
                            <SyncOutlined spin />
                          ) : (
                            'Update Profile'
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card">
                  <div className="card-body">
                    <div className="card-title">
                      <h6 className="text-uppercase">Update Password</h6>
                      <form
                        onSubmit={handlePasswordChange}
                        encType="multipart/form-data"
                      >
                        <input
                          type="password"
                          className="form-control mb-4 p-2"
                          value={passwordCurrent}
                          onChange={(e) => setPasswordCurrent(e.target.value)}
                          placeholder="Enter Current Password"
                          required
                        />

                        <input
                          type="text"
                          className="form-control mb-4 p-2"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter New Password"
                          required
                        />
                        <div className="d-grid gap-2">
                          <button
                            disabled={!passwordCurrent || !password || loading}
                            className="btn  w-100"
                            type="submit"
                            style={{
                              backgroundColor: '#33195a',
                              color: '#fff',
                            }}
                          >
                            {loading ? (
                              <SyncOutlined spin />
                            ) : (
                              'Update Password'
                            )}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4"></div>
            </div>
          </div>
        </div>
      </UserRoute>
    </Layout>
  );
};

export default UserProfilePage;
