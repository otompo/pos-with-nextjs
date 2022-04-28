import React, { useEffect, useState } from 'react';
import { MDBDataTable } from 'mdbreact';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import { Progress, Spin, Modal } from 'antd';
import {
  ExclamationCircleOutlined,
  DeleteOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import AdminRoute from '../routes/AdminRoutes';
import Layout from '../layout/Layout';
import TextTruncate from 'react-text-truncate';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loader from '../layout/Loader';

const { confirm } = Modal;

const ManagePrices = () => {
  const [values, setValues] = useState({
    name: '',
    description: '',
    loading: false,
    // video: {},
  });
  const [success, setSuccess] = useState(false);
  const [ok, setOk] = useState(false);
  const [prices, setPrices] = useState([]);
  const [uploadButtonText, setUploadButtonText] = useState('Upload Video');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [video, setVideo] = useState({});
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // console.log('previewVideo', video);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    showPrices();
  }, [success]);

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const showPrices = async () => {
    try {
      setValues({ ...values, loading: true });
      setOk(true);
      const { data } = await axios.get(`/api/admin/prices`);
      setPrices(data);
      setValues({ ...values, loading: false });
      setOk(false);
    } catch (err) {
      console.log(err);
      setValues({ ...values, loading: false });
      setOk(false);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setValues({ ...values, loading: true });
      setSuccess(true);
      const { data } = await axios.post(`/api/prices`, {
        ...values,
        video,
      });
      toast.success('Success');
      setValues({ ...values, name: '', description: '', loading: false });
      setSuccess(false);
    } catch (err) {
      console.log(err);
      setValues({ ...values, name: '', description: '', loading: false });
      setSuccess(false);
    }
  };

  const handleVideo = async (e) => {
    try {
      setLoading(true);
      const file = e.target.files[0];
      setUploadButtonText(file.name);
      const videoData = new FormData();
      videoData.append('video', file);
      //   console.log(file);
      // save progress bar and send video as form data to backend
      const { data } = await axios.post(`/api/upload/video`, videoData, {
        onUploadProgress: (e) => {
          setProgress(Math.round((100 * e.loaded) / e.total));
        },
      });
      // once response is received
      //   console.log(data);
      setVideo(data);
      // setValues({ ...values, video: data });
      setUploadButtonText('Upload Video');
      toast.success('Success');
      setLoading(false);
    } catch (err) {
      // console.log(err.response.data);
      setLoading(false);
      setUploadButtonText('Upload Video');
      toast.error('Video upload failed');
    }
  };

  const handleDelete = async (index) => {
    try {
      confirm({
        title: `Are you sure delete this price category`,
        icon: <ExclamationCircleOutlined />,
        content: 'It will be deleted permanentily if you click Yes',
        okText: 'Yes',
        okType: 'danger',
        cancelText: 'No',

        onOk() {
          setValues({ ...values, loading: true });
          let allPrices = prices;
          const removed = allPrices.splice(index, 1);
          setPrices(allPrices);
          // send request to server
          const { data } = axios.delete(`/api/admin/prices/${removed[0]._id}`);
          toast.success('Price Deleted Successfully');
          setValues({ ...values, loading: false });
        },
        onCancel() {
          return;
        },
      });
    } catch (err) {
      toast.error(err);
      setValues({ ...values, loading: false });
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
          label: 'Description',
          field: 'description',
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

    prices &&
      prices.forEach((price, index) => {
        data.rows.push({
          name: `${price && price.name}`,
          description: (
            <TextTruncate
              className="MessagesSnapshot-item"
              line={1}
              element="span"
              truncateText="…"
              text={price && price.description}
            />
          ),
          action: (
            <>
              <div className="row">
                <div className="col-md-12">
                  <span onClick={() => handleDelete(index)}>
                    <DeleteOutlined
                      className="text-danger d-flex justify-content-center "
                      style={{ cursor: 'pointer' }}
                    />
                  </span>
                </div>
              </div>
            </>
          ),
        });
      });

    return data;
  };
  return (
    <Layout title="Manage Prices">
      <AdminRoute>
        <div className="container m-2">
          <div className="row">
            <div className="col-md-4">
              <h1 className="lead">Manage Prices</h1>
            </div>
            <div className="col-md-4 offset-md-2">
              <p
                className="btn text-white float-right btn-success"
                onClick={showModal}
              >
                {' '}
                Add New Price
              </p>
            </div>
            <Modal
              title="Add Prices"
              visible={isModalVisible}
              onOk={handleOk}
              onCancel={handleCancel}
              footer={null}
            >
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <input
                    type="text"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    className="form-control mb-4 p-2"
                    placeholder="Enter name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="btn btn-dark btn-block text-left mt-3 text-center">
                    {loading ? (
                      <span className="spinLoader">
                        <Spin />
                      </span>
                    ) : (
                      `${uploadButtonText}`
                    )}

                    <input
                      onChange={handleVideo}
                      // value={values.video}
                      type="file"
                      accept="video/*"
                      hidden
                    />
                  </label>
                </div>
                <div className="form-group">
                  {progress > 0 && (
                    <Progress
                      className="d-flex justify-content-center pt-2"
                      percent={progress}
                      steps={10}
                    />
                  )}
                </div>

                <div className="form-group">
                  <textarea
                    rows="7"
                    name="description"
                    style={{ width: '100%' }}
                    value={values.description}
                    onChange={handleChange}
                  ></textarea>
                </div>
                <div className="d-grid gap-2 my-2 ">
                  <button
                    className="btn btn-primary"
                    disabled={!values.name || !values.description || loading}
                    type="submit"
                  >
                    {values.loading ? <SyncOutlined spin /> : 'Submit'}
                  </button>
                </div>
              </form>
            </Modal>
          </div>
        </div>
        <hr />
        {ok ? (
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
        {/* <pre>{JSON.stringify(prices, null, 4)}</pre> */}
      </AdminRoute>
    </Layout>
  );
};

export default ManagePrices;
