import { decrease, increase, removeFromCart } from '../actions/Actions';
import { DeleteOutlined } from '@ant-design/icons';
const CartItem = ({ item, dispatch, cart }) => {
  return (
    <tr>
      <td style={{ minWidth: '200px' }} className="w-50 align-middle">
        <h5 className="text-capitalize text-secondary">{item.name}</h5>

        <h6 className="text-danger">
          {' '}
          &#x20B5;{item.count * item.discountPrice}
        </h6>
        {item.quantity > 0 ? (
          <p className="mb-1 text-danger">In Stock: {item.quantity}</p>
        ) : (
          <p className="mb-1 text-danger">Out Stock</p>
        )}
      </td>

      <td className="align-middle" style={{ minWidth: '150px' }}>
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
      </td>

      <td
        className="align-middle"
        style={{ minWidth: '50px', cursor: 'pointer' }}
      >
        <div className="col-md-2 deletbtn">
          <DeleteOutlined
            style={{ fontSize: '28px' }}
            onClick={() => dispatch(removeFromCart(cart, item._id))}
          />
        </div>
      </td>
    </tr>
  );
};

export default CartItem;
