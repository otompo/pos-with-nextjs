import React, { Fragment, useState, useEffect, useContext } from 'react';
import TopTitle from '../home/TopTitle';
import { toast } from 'react-hot-toast';
import { SyncOutlined } from '@ant-design/icons';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/router';

const Register = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post(`/api/auth/register`, {
        name,
        email,
        password,
      });
      setName('');
      setEmail('');
      setPassword('');
      router.push('/login');
      toast.success('success');
      setLoading(false);
    } catch (err) {
      toast.error(err.response.data.message);
      setLoading(false);
    }
  };

  return (
    <Fragment>
      <div className="container-fluid industries-bnr">
        <div className="row">
          <div className="col-md-6 offset-md-3">
            <div className="text-center" style={{ marginTop: '150px' }}>
              <TopTitle
                welc={'Frotalian'}
                slogan={'Best Video Production Site'}
                // cname={"CODE SMART WEBSOFT"}
              />
            </div>
          </div>
        </div>
      </div>
      {/* <div className="container-fluid mb-5 mt-3">
        <div className="row">
          <div className="col-md-4 offset-md-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Register</h5>
                <form onSubmit={handleSubmit}>
                  <input
                    type="text"
                    className="form-control mb-4 p-2"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter name"
                    required
                  />
                  <input
                    type="email"
                    className="form-control mb-4 p-2"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email"
                    required
                  />
                  <input
                    type="password"
                    className="form-control mb-4 p-2"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    required
                  />
                  <div className="d-grid gap-2">
                    <button
                      disabled={!name || !email || !password || loading}
                      className="btn btn-primary"
                      type="submit"
                    >
                      {loading ? <SyncOutlined spin /> : 'Register'}
                    </button>
                  </div>
                </form>
                <p className="mt-4 text-center">
                  Already registered?
                  <Link href="/login">
                    <a> Login</a>
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </Fragment>
  );
};

export default Register;
