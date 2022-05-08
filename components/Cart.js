import React, { useEffect, useState, useContext } from 'react';
import { decrease, increase, removeFromCart } from '../actions/Actions';
import Zoom from 'react-reveal/Zoom';
import { DeleteOutlined } from '@ant-design/icons';
import Modal from 'react-modal';
import { Context } from '../context';

function Cart({ item, dispatch, cart }) {
  return (
    <div>
      <div className="cart">
        <Zoom>
          <ul className="cart-items">
            <>
              <div className="row">
                <div className="col-md-5">
                  <h6> {item.name}</h6>
                  <p>
                    {item.count} X GH&#x20B5; {item.discountPrice}= GH&#x20B5;{' '}
                    {(item.count * item.discountPrice).toFixed(2)}
                  </p>
                  <p>Tax: GH&#x20B5; {item.tax * item.count}</p>
                </div>
                <div className="col-md-5">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="stockCounter d-inline">
                        <button
                          className="btn btn-outline-secondary"
                          onClick={() => dispatch(decrease(cart, item._id))}
                          disabled={item.count === 1 ? true : false}
                        >
                          {' '}
                          -{' '}
                        </button>

                        <span className="px-3">{item.count}</span>

                        <button
                          className="btn btn-outline-secondary"
                          onClick={() => dispatch(increase(cart, item._id))}
                          disabled={item.count === item.quantity ? true : false}
                        >
                          {' '}
                          +{' '}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-2 deletbtn">
                  <DeleteOutlined
                    style={{ fontSize: '28px' }}
                    onClick={() => dispatch(removeFromCart(cart, item._id))}
                  />
                </div>
              </div>
              <hr />
              {/* <h6>Total</h6>
                <p>{Number(item.price) * item.count}</p> */}
            </>
          </ul>
        </Zoom>
      </div>
    </div>
  );
}

export default Cart;
