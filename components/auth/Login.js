import React, { useState, Fragment, useContext } from 'react';
import { getSession, signIn } from 'next-auth/client';
import TopTitle from '../home/TopTitle';
import { toast } from 'react-hot-toast';
import { Context } from '../../context';
import { useRouter } from 'next/router';
import { Spin } from 'antd';

const Login = () => {
  const router = useRouter();
  const { state, dispatch } = useContext(Context);
  const [email, setEmail] = useState('sasco@gmail.com');
  const [password, setPassword] = useState('otompo123@');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (!result.error) {
      setLoading(true);
      const session = await getSession();
      // console.log('SESSION', session);
      dispatch({
        type: 'LOGIN',
        payload: session.user,
      });
      // save in local storage
      window.localStorage.setItem('user', JSON.stringify(session.user));
      toast.success('SignIn Success');
      router.push('/user');
      setLoading(false);
    } else {
      toast.error(result.error);
      setLoading(false);
    }
  };

  return (
    <Fragment>
      <div className="container-fluid industries-bnr">
        <div className="row">
          <div className="col-md-6 offset-md-3">
            <div className="text-center" style={{ marginTop: '150px' }}>
              <TopTitle welc={'LOGIN'} cname={'CODE SMART POS'} />
            </div>
          </div>
        </div>
      </div>
      <div className="container-fluid mb-5 mt-3">
        <div className="row">
          <div className="col-md-4 offset-md-4">
            <div className="card">
              <div className="card-body">
                {/* <h5 className="card-title">Login</h5> */}
                <form onSubmit={handleSubmit}>
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
                      disabled={!email || !password || loading}
                      className="btn btn-primary"
                      type="submit"
                    >
                      {loading ? <Spin /> : 'Login'}
                    </button>
                  </div>
                </form>
                {/* <div className="row">
                  <div className="col-md-6">
                    <p className="mt-2 text-center">
                      Not yet registered?{' '}
                      <Link href="/register">
                        <a>Register</a>
                      </Link>
                    </p>
                  </div>
                  <div className="col-md-6">
                    <p className="mt-2 text-center ">
                      <Link href="/forgot-password">
                        <a className="text-danger">Forgot Password</a>
                      </Link>
                    </p>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Login;
