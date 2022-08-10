import React, { useEffect, useState } from 'react';
import { MDBDataTable } from 'mdbreact';
import { Tooltip, Modal, Avatar, Image } from 'antd';
import {
  EyeOutlined,
  DeleteOutlined,
  CoffeeOutlined,
  ExclamationCircleOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import AdminRoute from '../routes/AdminRoutes';
import Layout from '../layout/Layout';
import moment from 'moment';
import axios from 'axios';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import Loader from '../layout/Loader';
import Link from 'next/link';

const ManageUsers = () => {
  const { confirm } = Modal;
  const [values, setValues] = useState({
    name: '',
    email: '',
    loading: false,
  });
  const [users, setUsers] = useState([]);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    loadUsers();
  }, [success]);

  const router = useRouter();
  const { id } = router.query;

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/admin/users`);
      setUsers(data);
      setLoading(false);
    } catch (err) {
      console.log(err.response.data);
      setLoading(false);
    }
  };

  const handleDelete = (index) => {
    confirm({
      title: `Are you sure remove this User`,
      icon: <ExclamationCircleOutlined />,
      content: 'It will be deleted permanentily if you click Yes',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',

      onOk: async () => {
        try {
          setSuccess(true);
          let allusers = users;
          const removed = allusers.splice(index, 1);
          setUsers(allusers);
          // send request to server
          const { data } = await axios.delete(
            `/api/admin/users/${removed[0]._id}`,
          );
          toast.success('User Deleted Successfully');
          setSuccess(false);
        } catch (err) {
          console.log(err.response.data.messag);
          toast.error(err.response.data.message);
          setSuccess(false);
        }
      },
      onCancel() {
        return;
      },
    });
  };

  const removeUserAsAdmin = (index) => {
    confirm({
      title: `Are you sure remove this User as an Admin`,
      icon: <ExclamationCircleOutlined />,
      content: 'User Will no more be an Admin if you click yes',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          let allusers = users;
          const removed = allusers.splice(index, 1);
          // setSuccess(true);
          const { data } = await axios.put(
            `/api/admin/users/removeadmin/${removed[0]._id}`,
          );
          // setUsers(allusers);
          toast.success('Removed Successfully');
          // setSuccess(false);
        } catch (err) {
          console.log(err.response.data.message);
          // toast.error(err.response.data.message);
          // setSuccess(false);
        }
      },
      onCancel() {
        return;
      },
    });
  };

  const makeUserAnAdmin = async (e, id) => {
    try {
      setSuccess(true);
      const { data } = await axios.put(`/api/admin/users/addadmin/${id}`);
      setSuccess(false);
      toast.success('Great! User is now an admin');
    } catch (err) {
      console.log(err.response.data.messag);
      // toast.error(err.response.data.message);
      setSuccess(false);
    }
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setValues({ ...values, name: '', email: '', loading: true });
      setSuccess(true);
      const { data } = await axios.post(`/api/admin/addstaff`, {
        ...values,
      });
      toast.success('Success');
      setValues({ ...values, name: '', email: '', loading: false });
      setSuccess(false);
    } catch (err) {
      console.log(err.response.data.message);
      toast.error(err.response.data.message);
      setValues({ ...values, name: '', email: '', loading: false });
      setSuccess(false);
    }
  };
  const setData = () => {
    const data = {
      columns: [
        {
          label: 'Image',
          field: 'image',
          sort: 'asc',
        },
        {
          label: 'Name',
          field: 'name',
          sort: 'asc',
        },
        {
          label: 'Joined Date',
          field: 'join',
          sort: 'asc',
        },
        {
          label: 'Role',
          field: 'role',
          sort: 'asc',
        },
        {
          label: 'Email',
          field: 'email',
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

    users &&
      users.forEach((user, index) => {
        data.rows.push({
          image: user.profileImage ? (
            <Avatar
              size={30}
              src={
                <Image
                  src={user && user.profileImage && user.profileImage.Location}
                />
              }
            />
          ) : (
            <Avatar
              size={30}
              src={<Image src={user && user.picture} preview={false} />}
            />
          ),
          name: `${user.name}`,
          join: `${moment(user.createdAt).fromNow()}`,
          role: `${user.role}`,
          email: `${user.email}`,
          action: (
            <>
              <div className="row">
                <div className="col-md-6">
                  <Link
                    key={index}
                    href={`/admin/user/profile/${user.username}`}
                  >
                    <a>
                      <EyeOutlined className="text-success d-flex justify-content-center" />
                    </a>
                  </Link>
                </div>
                <div className="col-md-3">
                  {user && user.role.includes('Admin') ? (
                    <Tooltip title="Remove User as Admin">
                      <span
                        onClick={() => removeUserAsAdmin(index)}
                        // className="pt-1 pl-3"
                      >
                        <CoffeeOutlined
                          className="text-danger d-flex justify-content-center "
                          style={{ cursor: 'pointer' }}
                        />
                      </span>
                    </Tooltip>
                  ) : (
                    <Tooltip title="Make User as Admin">
                      <span
                        onClick={(e) => makeUserAnAdmin(e, user._id)}
                        // className="pt-1 pl-3"
                      >
                        <CoffeeOutlined
                          className="text-success d-flex justify-content-center "
                          style={{ cursor: 'pointer' }}
                        />
                      </span>
                    </Tooltip>
                  )}
                </div>
                <div className="col-md-3">
                  <Tooltip title="Delete User">
                    <span
                      onClick={() => handleDelete(index)}
                      // className="pt-1 pl-3"
                    >
                      <DeleteOutlined
                        className="text-danger d-flex justify-content-center "
                        style={{ cursor: 'pointer' }}
                      />
                    </span>
                  </Tooltip>
                </div>
              </div>
            </>
          ),
        });
      });

    return data;
  };

  return (
    <Layout title="Manage Staff">
      <AdminRoute>
        <div className="container m-2">
          <div className="row">
            <div className="col-md-4">
              <h1 className="lead">Manage Staff</h1>
            </div>
            <div className="col-md-4 offset-md-2">
              <p
                className="btn text-white float-right btn-success"
                onClick={showModal}
              >
                {' '}
                Add Staff
              </p>
            </div>
            <Modal
              title="Add Staff"
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
                  <input
                    type="text"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    className="form-control mb-4 p-2"
                    placeholder="Enter email"
                    required
                  />
                </div>
                <div className="d-grid gap-2 my-2 ">
                  <button
                    className="btn btn-primary"
                    disabled={!values.name || !values.email}
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

export default ManageUsers;
