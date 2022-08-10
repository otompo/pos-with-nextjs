import { useState, useEffect } from 'react';
import '../styles/globals.css';

import Router from 'next/router';
import { AuthProvider } from '../context';
import { CartProvider } from '../context/cartContext';
import { Toaster } from 'react-hot-toast';

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
      <Toaster />
      <CartProvider>
        <Component {...pageProps} />
      </CartProvider>
      {/* {loading ? <Loader /> :}</>; */}
    </AuthProvider>
  );
}

export default MyApp;
