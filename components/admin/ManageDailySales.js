import React, { useEffect, useState } from 'react';
import { Spin, Modal, Avatar, Image } from 'antd';
import {
  ExclamationCircleOutlined,
  DeleteOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import AdminRoute from '../routes/AdminRoutes';
import Layout from '../layout/Layout';
import moment from 'moment';
import TextTruncate from 'react-text-truncate';
import axios from 'axios';
import { toast } from 'react-toastify';
import Resizer from 'react-image-file-resizer';
import Loader from '../layout/Loader';

const { confirm } = Modal;

const ManageDailySales = () => {
  return (
    <Layout title="Manage Daily Sales">
      <AdminRoute>
        <h1 className="lead">Manage Daily Sales</h1>
        <hr />

        {/* <pre>{JSON.stringify(prices, null, 4)}</pre> */}
      </AdminRoute>
    </Layout>
  );
};

export default ManageDailySales;
