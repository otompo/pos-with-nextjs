import React, { useEffect, useState } from 'react';
import { Modal, Progress } from 'antd';
import Link from 'next/link';
import {
  DeleteOutlined,
  EyeOutlined,
  SyncOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';
import AdminRoute from '../routes/AdminRoutes';
import Layout from '../layout/Layout';
import { toast } from 'react-toastify';
const { confirm } = Modal;

const ManageStatistics = () => {
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  return (
    <Layout title="Manage Statistics">
      <AdminRoute>
        <h1 className="lead">Manage Statistics</h1>
        <hr />

        {/* <pre>{JSON.stringify(categories, null, 4)}</pre> */}
      </AdminRoute>
    </Layout>
  );
};

export default ManageStatistics;
