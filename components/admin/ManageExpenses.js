import React, { useEffect, useState } from 'react';
import { MDBDataTable } from 'mdbreact';
import { Modal } from 'antd';
import {
  ExclamationCircleOutlined,
  DeleteOutlined,
  SyncOutlined,
  EditFilled,
} from '@ant-design/icons';
import AdminRoute from '../routes/AdminRoutes';
import Layout from '../layout/Layout';
import moment from 'moment';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Loader from '../layout/Loader';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Link from 'next/link';
import FormatCurrency from '../FormatCurrency';

const { confirm } = Modal;

const ManageExpenses = () => {
  const [values, setValues] = useState({
    name: '',
    amount: '',
    loading: false,
  });

  const [success, setSuccess] = useState(false);
  const [ok, setOk] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [expenseDate, setExpenseDate] = useState(new Date());
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
    showExpenses();
  }, [success]);

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const showExpenses = async () => {
    try {
      setValues({ ...values, loading: true });
      setOk(true);
      const { data } = await axios.get(`/api/admin/expenses`);
      setExpenses(data);
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
      const { data } = await axios.post(`/api/admin/expenses`, {
        ...values,
        expenseDate,
      });
      toast.success('Success');
      setValues({ ...values, name: '', amount: '', loading: false });
      setSuccess(false);
    } catch (err) {
      console.log(err);
      // toast.error(err.response.data.message);
      setValues({ ...values, name: '', amount: '', loading: false });
      setSuccess(false);
    }
  };

  const handleDelete = async (index) => {
    try {
      confirm({
        title: `Are you sure delete this  expenses`,
        icon: <ExclamationCircleOutlined />,
        content: 'It will be deleted permanentily if you click Yes',
        okText: 'Yes',
        okType: 'danger',
        cancelText: 'No',

        onOk() {
          setValues({ ...values, loading: true });
          let allExpenses = expenses;
          const removed = allExpenses.splice(index, 1);
          setExpenses(allExpenses);
          // send request to server
          const { data } = axios.delete(
            `/api/admin/expenses/delete/${removed[0]._id}`,
          );
          toast.success('Deleted Successfully');
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
          label: 'Amount',
          field: 'amount',
          sort: 'asc',
        },
        {
          label: 'Date',
          field: 'date',
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

    expenses &&
      expenses.forEach((expense, index) => {
        data.rows.push({
          name: `${expense && expense.name}`,
          //   amount: `GH₵ ${expense && expense.amount.toFixed(2)}`,
          amount: `${FormatCurrency(expense.amount)}`,
          date: `${moment(expense.date).format('LL')}`,

          action: (
            <>
              <div className="row">
                <div className="col-md-6">
                  <span onClick={() => handleDelete(index)}>
                    <DeleteOutlined
                      className="text-danger d-flex justify-content-center "
                      style={{ cursor: 'pointer', fontSize: '20px' }}
                    />
                  </span>
                </div>
                <div className="col-md-6">
                  <Link href={`/admin/expenses/${expense.slug}`}>
                    <a>
                      <EditFilled
                        className="text-success d-flex justify-content-center "
                        style={{ cursor: 'pointer', fontSize: '20px' }}
                      />
                    </a>
                  </Link>
                </div>
              </div>
            </>
          ),
        });
      });

    return data;
  };
  return (
    <Layout title="Manage Expenses">
      <AdminRoute>
        <div className="container m-2">
          <div className="row">
            <div className="col-md-4">
              <h1 className="lead">Manage Expenses</h1>
            </div>
            <div className="col-md-4 offset-md-2">
              <p
                className="btn text-white float-right btn-success"
                onClick={showModal}
              >
                {' '}
                Add New Expenses
              </p>
            </div>
            <Modal
              title="Add Expense"
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
                    name="amount"
                    value={values.amount}
                    onChange={handleChange}
                    className="form-control mb-4 p-2"
                    placeholder="Enter amount"
                    required
                  />
                </div>
                <div className="form-group">
                  {/* <label>
                    <h6 className="d-inline">Format:</h6>
                    <span className="d-inline">DD/MM/Y</span>
                  </label> */}
                  <DatePicker
                    className="w-100"
                    selected={expenseDate}
                    onChange={(date) => setExpenseDate(date)}
                    // minDate={new Date()}
                    dateFormat="MMMM d, yyyy"
                    isClearable
                    placeholderText="I have been cleared!"
                  />
                </div>
                <div className="d-grid gap-2 my-2 ">
                  <button
                    className="btn btn-primary"
                    disabled={!values.name || !values.amount}
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
        {/* <pre>{JSON.stringify(categories, null, 4)}</pre> */}
      </AdminRoute>
    </Layout>
  );
};

export default ManageExpenses;
