import { useReducer, createContext, useEffect } from 'react';
import reducers from '../actions/Reducers';

// create context
const CartContext = createContext();

// root reducer
// const cartReducer = (state, action) => {
//   switch (action.type) {
//     case 'ADD_TO_CART':
//       return { ...state, cartItems: action.payload };
//     case 'REMOVE_FROM_CART':
//       return { ...state, cartItems: action.payload };
//     default:
//       return state;
//   }
// };

// context provider
const CartProvider = ({ children }) => {
  // initial state
  const initialState = {
    cart: [],
  };
  const [state, dispatch] = useReducer(reducers, initialState);
  const { cart } = state;

  useEffect(() => {
    const __next__cart01__devat = JSON.parse(
      localStorage.getItem('__next__cart01__devat'),
    );

    if (__next__cart01__devat)
      dispatch({ type: 'ADD_CART', payload: __next__cart01__devat });
  }, []);

  useEffect(() => {
    localStorage.setItem('__next__cart01__devat', JSON.stringify(cart));
  }, [cart]);

  // useEffect(() => {
  //   localStorage.setItem('cartItems', JSON.stringify(cart));
  // }, [cart]);

  // useEffect(() => {
  //   dispatch({
  //     type: 'ADD_TO_CART',
  //     payload: JSON.parse(localStorage.getItem('cartItems')),
  //   });

  //   dispatch({
  //     type: 'REMOVE_FROM_CART',
  //     payload: JSON.parse(localStorage.getItem('cartItems')),
  //   });
  // }, []);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export { CartContext, CartProvider };
