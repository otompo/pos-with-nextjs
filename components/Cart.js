import React, { useEffect, useState, useContext } from 'react';
import Fade from 'react-reveal/Fade';
import { DeleteOutlined } from '@ant-design/icons';
import Modal from 'react-modal';
import { Context } from '../context';

function Cart({ cartItems, product }) {
  const { state, dispatch } = useContext(Context);

  useEffect(() => {}, []);

  const increaseQty = (cartItems, id) => {
    const newData = [...cartItems];
    // console.log('newData', newData);
    let alreadyExists = false;
    newData.forEach((item) => {
      if (item._id === id) {
        alreadyExists = true;
        item.count++;
      }
    });
    if (!alreadyExists) {
      state.cartItems && cartItems.push({ ...newData, count: 1 });
    }
    dispatch({
      type: 'ADD_TO_CART',
      payload: newData,
    });
    localStorage.setItem('cartItems', JSON.stringify(newData));
  };

  const decreaseQty = (cartItems, id) => {
    const newData = [...cartItems];
    newData.forEach((item) => {
      if (item._id === id) item.count -= 1;
    });
    dispatch({
      type: 'ADD_TO_CART',
      payload: newData,
    });
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  };

  const removeFromCart = (product) => {
    console.log(product);
    cartItems.slice().filter((x) => x._id !== product._id);
    dispatch({
      type: 'ADD_TO_CART',
      payload: cartItems,
    });
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  };

  return (
    <div>
      {cartItems.length === 0 ? (
        <div className="cart cart-header">Cart is empty</div>
      ) : (
        <div className="cart cart-header">
          You have {cartItems.length} in the cart{' '}
        </div>
      )}
      <hr />

      <div className="cart">
        <Fade left cascade>
          <ul className="cart-items">
            {cartItems.map((item, i) => (
              <>
                <div className="row" key={i}>
                  <div className="col-md-4">
                    <h6> {item.name}</h6>
                    <p>&#x20B5;{item.price}</p>
                  </div>
                  <div className="col-md-6">
                    <div className="row">
                      <div className="col-md-12">
                        <div className="stockCounter d-inline">
                          <button
                            className="btn btn-danger minus"
                            onClick={() => decreaseQty(cartItems, item._id)}
                            disabled={item.quantity === 1}
                          >
                            -
                          </button>

                          <span className="px-3">{item.count}</span>

                          <button
                            className="btn btn-primary plus"
                            onClick={() => increaseQty(cartItems, item._id)}
                            disabled={cartItems.quantity === item.quantity}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-2 deletbtn">
                    <DeleteOutlined
                      style={{ fontSize: '28px' }}
                      onClick={() => removeFromCart(item, item._id)}
                    />
                  </div>
                </div>
                <hr />
                {/* <h6>Total</h6>
                <p>{Number(item.price) * item.count}</p> */}
              </>
            ))}
          </ul>
        </Fade>
      </div>
    </div>
  );
}

export default Cart;
