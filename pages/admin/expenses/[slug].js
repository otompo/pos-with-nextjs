import { useEffect, useState } from 'react';
import { getSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { Badge, Spin, Card } from 'antd';
import moment from 'moment';
import axios from 'axios';
import Layout from '../../../components/layout/Layout';
import AdminRoute from '../../../components/routes/AdminRoutes';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const EditExpense = () => {
  const [values, setValues] = useState({
    name: '',
    amount: '',
    date: '',
  });
  var preData = moment(values.date).format('DD/MM/Y');

  const router = useRouter();
  const { slug } = router.query;
  const [loading, setLoading] = useState(false);
  const [expenseDate, setExpenseDate] = useState(Date(preData).toDateString);
  // console.log(expenseDate);

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    loadSingleExpense();
  }, [slug]);

  const loadSingleExpense = async () => {
    try {
      const { data } = await axios.get(`/api/admin/expenses/${slug}`);
      setValues(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.put(`/api/admin/expenses/${slug}`, {
        name: values.name,
        amount: values.amount,
        expenseDate,
      });
      setLoading(false);
      toast.success('success');
      router.push('/admin/expenses');
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  return (
    <Layout title={slug}>
      <AdminRoute>
        <div>
          <h1 className="lead"> Edit Expense</h1>
          <hr />
          <div className="container-fluid my-5">
            <div className="row">
              <div className="col-md-4 offset-md-4">
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
                  <div className="form-group mt-4">
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
                  <div className="form-group mb-4">
                    <label>
                      <h6 className="d-inline">Format:</h6>
                      <p className="d-inline lead"> DD/MM/Y</p>
                    </label>
                    <DatePicker
                      className="w-100"
                      selected={expenseDate}
                      onChange={(date) => setExpenseDate(date)}
                      // minDate={new Date()}
                      dateFormat="dd/MM/YYY"
                      value={expenseDate ? expenseDate : preData}
                      isClearable
                      placeholderText="I have been cleared!"
                    />
                  </div>
                  <div className="d-grid gap-2 my-2 ">
                    <button className="btn btn-primary" type="submit">
                      {values.loading ? <Spin /> : 'Submit'}
                    </button>
                  </div>
                </form>
              </div>
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

export default EditExpense;
