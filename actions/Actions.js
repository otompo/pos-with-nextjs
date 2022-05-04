export const ACTIONS = {
  ADD_CART: 'ADD_CART',
  ADD_ORDERS: 'ADD_ORDERS',
};
import { toast } from 'react-toastify';
export const addToCart = (product, cart) => {
  if (product.quantity === 0)
    return toast.error('This product is out of stock.');

  const check = cart.every((item) => {
    return item._id !== product._id;
  });

  if (!check) return toast.error('The product has been added to cart.');
  // toast.success(`${product.name} Added to cart`);
  return { type: 'ADD_CART', payload: [...cart, { ...product, count: 1 }] };
};

export const decrease = (data, id) => {
  const newData = [...data];
  newData.forEach((item) => {
    if (item._id === id) item.count -= 1;
  });

  return { type: 'ADD_CART', payload: newData };
};

export const increase = (data, id) => {
  const newData = [...data];
  newData.forEach((item) => {
    if (item._id === id) item.count += 1;
  });
  return { type: 'ADD_CART', payload: newData };
};

export const removeFromCart = (data, id) => {
  const newData = [...data];

  newData.forEach((item, index) => {
    if (item._id === id) {
      console.log(item._id);
      newData.splice(index, 1);
    }
  });
  toast.success(`remove from cart`);
  return { type: 'ADD_CART', payload: newData };
};
