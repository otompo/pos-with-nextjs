import React, { useState, useEffect, useContext } from 'react';
import { CartContext } from '../context/cartContext';
import Layout from './layout/Layout';
import Link from 'next/link';
import UserRoutes from './routes/UserRoutes';
import CartItem from './CartItem';
import { useRouter } from 'next/router';

function ManageCartItems(props) {
  const router = useRouter();
  const { state, dispatch } = useContext(CartContext);
  const { cart } = state;
  const [total, setTotal] = useState(0);
  const [address, setAddress] = useState('');
  const [mobile, setMobile] = useState('');

  useEffect(() => {
    if (cart.length === 0) {
      router.push('/user');
    }
    const getTotal = () => {
      const res = cart.reduce((prev, item) => {
        return prev + item.discountPrice * item.count;
      }, 0);

      setTotal(res);
    };

    getTotal();
  }, [cart]);

  return (
    <Layout title="Manage Cart Items">
      <UserRoutes>
        <div className="row my-3">
          <div className="col-md-4">
            <h1 className="lead">Manage Cart Items</h1>
          </div>
          <div className="col-md-6 offset-md-2">
            <div className="row">
              <div className="col-md-8">
                <h2>TOTAL:GH&#x20B5; {total}.00</h2>
              </div>
              <div className="col-md-4 float-left">
                <Link href="/">
                  <a className="btn btn-dark">Proceed with payment</a>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <hr />
        <div className="row max-auto">
          <div className="col-md-8 text-secondary table-responsive my-3">
            <h2 className="text-uppercase">Shopping List</h2>

            <table className="table my-3">
              <tbody>
                {cart.map((item) => (
                  <CartItem
                    key={item._id}
                    item={item}
                    dispatch={dispatch}
                    cart={cart}
                  />
                ))}
              </tbody>
            </table>
          </div>

          <div className="col-md-4 my-3 text-right text-uppercase text-secondary">
            <form>
              <h2>Payment Mode</h2>

              <label htmlFor="address">Address</label>
              <input
                type="text"
                name="address"
                id="address"
                className="form-control mb-2"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />

              <label htmlFor="mobile">Mobile</label>
              <input
                type="text"
                name="mobile"
                id="mobile"
                className="form-control mb-2"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
              />
            </form>
          </div>
        </div>

        {/* <pre>{JSON.stringify(cart, null, 4)}</pre> */}
      </UserRoutes>
    </Layout>
  );
}

export default ManageCartItems;
