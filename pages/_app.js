import { useState, useEffect } from 'react';
import '../styles/globals.css';
// import { csrfToken } from '../node_modules/csrf';
import Router from 'next/router';
import Loader from '../components/layout/Loader';
import { AuthProvider } from '../context';
import { CartProvider } from '../context/cartContext';

function MyApp({ Component, pageProps }) {
  const [loading, setLoading] = useState(false);
  Router.events.on('routeChangeStart', (url) => {
    // console.log('Route is Changing...');
    setLoading(true);
  });
  Router.events.on('routeChangeComplete', (url) => {
    // console.log('Route is complete...');
    setLoading(false);
  });
  Router.events.on('routeChangeError', (url) => {
    // console.log('Route is complete...');
    setLoading(false);
  });

  return (
    <AuthProvider>
      <CartProvider>
        <Component {...pageProps} />
      </CartProvider>
      {/* {loading ? <Loader /> :}</>; */}
    </AuthProvider>
  );
}

export default MyApp;
