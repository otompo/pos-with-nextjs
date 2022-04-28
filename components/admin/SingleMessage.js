import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { SyncOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import renderHTML from 'react-render-html';

import dynamic from 'next/dynamic';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import '../../node_modules/react-quill/dist/quill.snow.css';
import { QuillFormats, QuillModules } from '../../helpers/quill';
import { Button, Tooltip, Modal } from 'antd';
import moment from 'moment';
import AdminRoute from '../routes/AdminRoutes';
import Layout from '../layout/Layout';

const SingleMessage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState({});
  const [success, setSuccess] = useState(false);
  const [replyedMessage, setReplyedMessage] = useState({});

  const [values, setValues] = useState({
    email: '',
    // replyedMessage: '',
    loading: false,
  });

  useEffect(() => {
    loadMessage();
  }, [id, success]);

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setValues({ ...values, loading: true });
      setSuccess(true);
      const { data } = await axios.post(`/api/admin/messages/${id}`, {
        ...values,
        replyedMessage,
      });
      // console.log(data);
      setValues({ ...values, email: '', loading: false });
      setReplyedMessage({});
      toast.success('Message successfully send ');
      setSuccess(false);
    } catch (err) {
      // console.log(err);
      toast.error(err.response.data.message);
      setValues({ ...values, email: '', loading: false });
      setSuccess(false);
    }
  };

  const loadMessage = async () => {
    try {
      const { data } = await axios.get(`/api/admin/messages/${id}`);
      setMessage(data);
    } catch (err) {
      console.log(err);
    }
  };

  const modal = (
    <Modal
      title="Reply Message"
      width={800}
      centered
      visible={visible}
      onCancel={() => {
        setVisible(false);
      }}
      footer={null}
    >
      <div className="container-fluid">
        <form onSubmit={handleSubmit} className="py-3">
          <div className="row">
            <div className="form-group">
              {' '}
              <input
                type="text"
                // className="form-control"
                name="email"
                className="form-control mb-4 "
                value={values.email}
                onChange={handleChange}
                placeholder="Enter email"
                required
              />
            </div>
            <div className="form-group">
              <ReactQuill
                name="editor"
                theme={'snow'}
                modules={QuillModules}
                formats={QuillFormats}
                placeholder="Write something amazing..."
                onChange={setReplyedMessage}
                // name="replyedMessage"
                value={replyedMessage}
              />
            </div>
            <div className="form-group">
              <div className="d-grid gap-2">
                <button
                  disabled={!values.email || values.loading}
                  loading={values.loading}
                  className="btn btn-primary"
                  type="submit"
                >
                  {/* {loading ? <SyncOutlined spin /> : 'Submit'} */}
                  {values.loading ? <SyncOutlined spin /> : 'Submit'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );

  const TopInfo = () => {
    return (
      <div className="container-fluid mb-5 mt-3">
        <div className="row">
          <div className="col-md-8">
            <h1 className="lead">Meesage</h1>
          </div>
          <div className="col-md-4">
            {message && message.replyed ? (
              ''
            ) : (
              <>
                {modal}
                {/* <Button
                  type="primary"
                  size="large"
                  shape="round"
                  onClick={() => setVisible(true)}
                  // className="btn btn-success block"
                >
                  <Tooltip title="Reply Message">Reply</Tooltip>
                </Button> */}
              </>
            )}
          </div>
        </div>
        <hr />
      </div>
    );
  };

  return (
    <Layout title={message && message.message}>
      <AdminRoute>
        <div>
          {TopInfo()}

          <div className="row">
            <div className="col-md-10 offset-md-1">
              <div className="card">
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-4">
                      {' '}
                      SENDER: <h1 className="lead">{message.name}</h1>
                    </div>
                    <div className="col-md-4">
                      EMAIL: <h1 className="lead">{message.email}</h1>
                    </div>
                    <div className="col-md-4">
                      SUBJECT: <h1 className="lead">{message.subject}</h1>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-10  offset-md-1 mt-3">
              <div className="card">
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-8">
                      <h6 className="text-primary">Received Message:</h6>
                    </div>
                    <div className="col-md-4 text-success">
                      Time: {moment(message.createdAt).fromNow()}
                    </div>
                  </div>
                  {message.message ? (
                    <div>{renderHTML(message.message)}</div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          {message && message.replyedMessage ? (
            <div className="row">
              <div className="col-md-10  offset-md-1 mt-3">
                <div className="card">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-8">
                        <h6 className="text-primary">Replyed Message:</h6>
                      </div>
                      <div className="col-md-4 text-success">
                        Time: {moment(message.replyedDate).fromNow()}
                      </div>
                    </div>
                    {/* {message.replyedMessage ? (
                    <div>{renderHTML(message.replyedMessage)}</div>
                  ) : null} */}

                    {!success && message.replyedMessage ? (
                      <div>{renderHTML(message.replyedMessage)}</div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            ''
          )}
        </div>
      </AdminRoute>
    </Layout>
  );
};

export default SingleMessage;
