import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { SyncOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
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
  const [saving, setSaving] = useState(false);
  const [progress, setProgress] = useState(false);
  const [profileImage, setProfileImage] = useState({});
  const [imagePreview, setImagePreview] = useState('');
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

  const handleProfileImage = (e) => {
    e.preventDefault();
    let file = e.target.files[0];
    setImagePreview(window.URL.createObjectURL(file));
    // show image name
    // setUploadButtonText(file.name);
    setProgress(true);
    // resize image and send image to backend
    Resizer.imageFileResizer(file, 720, 500, 'JPEG', 100, 0, async (uri) => {
      try {
        let { data } = await axios.post(`/api/user/profileimage`, {
          profileImage: uri,
        });
        // set image in the state
        setProfileImage(data);
        setProgress(false);
        toast.success('Success');
      } catch (err) {
        console.log(err.response.data.message);
        setProgress(false);
      }
    });
  };

  const profileImageSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const { data } = await axios.put(`/api/user/profileimage/updateimage`, {
        profileImage,
      });
      const as = JSON.parse(await window.localStorage.getItem('user'));
      as.user = data;
      // console.log(as.user);
      dispatch({
        type: 'UPDATE_SUCCESS',
        payload: as.user,
      });
      setSaving(false);
      toast.success('Image Saved');
    } catch (err) {
      console.log(err.response.data.message);
      setSaving(false);
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

  const uploadImageButton = () => {
    return (
      <form>
        <div className="form-group">
          <label
            style={{ width: '30%' }}
            className="btn btn-outline-secondary  text-left my-3 "
          >
            {/* Upload Profile Image */}
            {progress ? <Spin /> : 'Upload Profile Image'}
            <input
              type="file"
              name="profileImage"
              size="large"
              onChange={handleProfileImage}
              accept="image/*"
              hidden
            />
          </label>
        </div>

        <Button
          onClick={(e) => profileImageSubmit(e)}
          style={{ width: '30%' }}
          disabled={progress}
          // className="btn btn-primary block"
          type="primary"
          shape="round"
          size="large"
        >
          {saving ? <SyncOutlined spin /> : 'Save Image'}
        </Button>
      </form>
    );
  };

  const updatepasswordForm = () => {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-8 offset-md-2 mt-4 mb-5">
            <form onSubmit={handlePasswordChange} encType="multipart/form-data">
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
                  style={{ backgroundColor: '#33195a', color: '#fff' }}
                >
                  {loading ? <SyncOutlined spin /> : 'Update Password'}
                </button>
              </div>
            </form>
            {/* <pre>{JSON.stringify(values, null, 4)}</pre> */}
          </div>
        </div>
      </div>
    );
  };

  const headerTaps = () => {
    return (
      <>
        <nav>
          <div className="nav nav-tabs" id="nav-tab" role="tablist">
            <button
              className="nav-link active"
              id="nav-home-tab"
              data-bs-toggle="tab"
              data-bs-target="#nav-home"
              type="button"
              role="tab"
              aria-controls="nav-home"
              aria-selected="true"
            >
              <h4>Update Profile</h4>
            </button>
            <button
              className="nav-link"
              id="nav-profile-tab"
              data-bs-toggle="tab"
              data-bs-target="#nav-profile"
              type="button"
              role="tab"
              aria-controls="nav-profile"
              aria-selected="false"
            >
              <h4>Update Profile Image</h4>
            </button>
            <button
              className="nav-link"
              id="nav-password-tab"
              data-bs-toggle="tab"
              data-bs-target="#nav-password"
              type="button"
              role="tab"
              aria-controls="nav-password"
              aria-selected="false"
            >
              <h4>Update Password</h4>
            </button>
          </div>
        </nav>
        <div className="tab-content" id="nav-tabContent">
          <div
            className="tab-pane fade show active"
            id="nav-home"
            role="tabpanel"
            aria-labelledby="nav-home-tab"
          >
            {ok ? <Loader /> : UpdateForm()}
          </div>
          <div
            className="tab-pane fade"
            id="nav-profile"
            role="tabpanel"
            aria-labelledby="nav-profile-tab"
          >
            {ok ? <Loader /> : profileImageForm()}
          </div>
          <div
            className="tab-pane fade"
            id="nav-password"
            role="tabpanel"
            aria-labelledby="nav-password-tab"
          >
            {updatepasswordForm()}
          </div>
        </div>
      </>
    );
  };

  const profileImageForm = () => {
    return (
      <div className="container-fluid mb-5 mt-3">
        <div className="row">
          <div className="col-md-8 offset-md-2">
            {
              <Badge>
                <div className="card">
                  <div className="card-body">
                    {imagePreview ? (
                      <Avatar size={215} src={imagePreview} />
                    ) : (
                      <Avatar
                        size={190}
                        src={
                          <Image
                            style={{
                              color: '#000',
                              fontSize: '19px',
                              fontWeight: 'bold',
                            }}
                            src={
                              values.profileImage &&
                              values.profileImage.Location
                            }
                            alt={values.name && values.name}
                          />
                        }
                      />
                    )}
                  </div>
                </div>
              </Badge>
            }

            {uploadImageButton()}
          </div>
        </div>
      </div>
    );
  };

  const UpdateForm = () => {
    return (
      <div className="container-fluid mb-5 mt-3">
        <div className="row">
          <div className="col-md-8 offset-md-2">
            <div className="card">
              <div className="card-body">
                {/* <h5 className="card-title">Edit Your Profile</h5> */}
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col">
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
                    <div className="col">
                      {' '}
                      <input
                        name="email"
                        type="email"
                        className="form-control mb-4 p-2"
                        value={values.email}
                        onChange={handleChange}
                        placeholder="Enter email"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <input
                      type="text"
                      name="facebook"
                      className="form-control mb-4 p-2"
                      value={values.facebook}
                      onChange={handleChange}
                      placeholder="Enter Facebook url"
                    />
                  </div>

                  <div className="form-group">
                    <input
                      name="twitter"
                      type="text"
                      className="form-control mb-4 p-2"
                      value={values.twitter}
                      onChange={handleChange}
                      placeholder="Enter Twitter url"
                    />
                  </div>
                  <div className="form-group">
                    <input
                      name="linkedIn"
                      type="text"
                      className="form-control mb-4 p-2"
                      value={values.linkedIn}
                      onChange={handleChange}
                      placeholder="Enter LinkedIn url"
                    />
                  </div>

                  <div className="form-group">
                    <textarea
                      name="bio"
                      cols="7"
                      rows="7"
                      value={values.bio}
                      className="form-control"
                      onChange={handleChange}
                    ></textarea>
                  </div>
                  <input
                    type="file"
                    name="profileImage"
                    size="large"
                    onChange={handleChange}
                    accept="image/*"
                    hidden
                  />
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
        </div>
      </div>
    );
  };

  return (
    <Layout title={values.name && values.name}>
      <UserRoute>
        <div>
          {TopInfo()}
          {headerTaps()}
        </div>
      </UserRoute>
    </Layout>
  );
};

export default UserProfilePage;
