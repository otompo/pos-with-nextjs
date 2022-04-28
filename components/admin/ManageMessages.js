import React, { useEffect, useState } from 'react';
import { MDBDataTable } from 'mdbreact';
// import '@fortawesome/fontawesome-free/css/all.min.css';
// import 'bootstrap-css-only/css/bootstrap.min.css';
// import 'mdbreact/dist/css/mdb.css';
import { Tooltip, Modal } from 'antd';
import {
  EyeOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import AdminRoute from '../routes/AdminRoutes';
import Layout from '../layout/Layout';
import Loader from '../layout/Loader';
import moment from 'moment';
import axios from 'axios';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import Link from 'next/link';

const ManageMessages = () => {
  const { confirm } = Modal;

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadMessages();
  }, []);

  const router = useRouter();
  const { id } = router.query;

  const loadMessages = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/admin/messages`);
      setMessages(data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const handleDelete = (index) => {
    confirm({
      title: `Are you sure remove this Message`,
      icon: <ExclamationCircleOutlined />,
      content: 'It will be deleted permanentily if you click Yes',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',

      onOk: async () => {
        try {
          setLoading(true);
          let allmessages = messages;
          const removed = allmessages.splice(index, 1);
          // console.log('removed', removed[0]._id);
          setMessages(allmessages);
          // send request to server
          const { data } = await axios.delete(
            `/api/admin/messages/${removed[0]._id}`,
          );
          // console.log('LESSON DELETED =>', data);
          toast.success('Message Deleted Successfully');
          setLoading(false);
        } catch (err) {
          toast.error(err.response.data.message);
          setSuccess(false);
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
          label: 'Name',
          field: 'name',
          sort: 'asc',
        },
        {
          label: 'Email',
          field: 'email',
          sort: 'asc',
        },
        {
          label: 'Subject',
          field: 'subject',
          sort: 'asc',
        },

        {
          label: 'Send Date',
          field: 'send',
          sort: 'asc',
        },
        {
          label: 'View',
          field: 'view',
          sort: 'asc',
        },
        {
          label: 'Replyed',
          field: 'replyed',
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

    messages &&
      messages.forEach((message, index) => {
        data.rows.push({
          name: `${message.name}`,
          email: `${message.email}`,
          subject: `${message.subject}`,
          send: `${moment(message.createdAt).fromNow()}`,
          view: (
            <Tooltip title="View message">
              <Link href={`/admin/messages/${message._id}`}>
                <a>
                  <EyeOutlined className="text-success d-flex justify-content-center" />
                </a>
              </Link>
            </Tooltip>
          ),
          replyed: `${message && message.replyed ? 'YES' : 'NO'}`,
          // action: (
          //   <>
          //     <div className="row">
          //       <div className="col-md-6">
          //         <span onClick={() => handleDelete(index)}>
          //           <DeleteOutlined
          //             className="text-danger d-flex justify-content-center "
          //             style={{ cursor: 'pointer' }}
          //           />
          //         </span>
          //       </div>
          //     </div>
          //   </>
          // ),
        });
      });

    return data;
  };

  return (
    <Layout title="Manage Messages">
      <AdminRoute>
        <h1 className="lead">Manage Messages</h1>
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
      </AdminRoute>
    </Layout>
  );
};

export default ManageMessages;
