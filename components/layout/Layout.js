import { useContext, useEffect, useState } from 'react';
import { getSession } from 'next-auth/client';
import Head from 'next/head';
import { ToastContainer } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'nprogress/nprogress.css';
import 'antd/dist/antd.css';
import Login from '../auth/Login';
import Navbar from '../Navbar';
import Footer from '../Footer';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const Layout = ({ children, title = 'POS' }) => {
  const [currentUser, setCurrentUser] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCurrentUser();
  }, []);

  const loadCurrentUser = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/user/profile');
      // console.log(data);
      setCurrentUser(data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };
  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta
          name="description"
          content="Get all your quality video production when it comes to Video production services Specialize in weddings
          Commercial & private video advertising
          Film making
          Parties videos
          Family videos
          Business events videos"
        />
        <meta
          property="og:title"
          content="Afrotalian is  the best organization to contact when it comes to video production"
        />
        <meta
          property="og:description"
          content="Contact us tor your quality video production when it comes to Video production services Specialize in weddings
          Commercial & private video advertising
          Film making
          Parties videos
          Family videos
          Business events videos"
        />

        <meta property="og:site_name" content="CODE SMART WEBSOFT" />
        <meta
          property="og:image"
          content="https://codesmartwebsoft.com/img/default.png"
        />
        <meta
          property="og:image:secure_url"
          content="https://codesmartwebsoft.com/img/default.png"
        />
      </Head>
      {/* <Navbar /> */}
      <ToastContainer position="bottom-right" />
      {children}

      {/* <Footer /> */}
    </div>
  );
};
export default Layout;

export async function getServerSideProps(context) {
  const session = await getSession({
    req: context.req,
  });
  if (session) {
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
