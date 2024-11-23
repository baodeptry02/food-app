import { combineReducers } from 'redux';
import userReducer from './userReducer';
import productReducer from './productReducer';
import cartReducer from './cartReducer';

const myReducer = combineReducers({
  userState: userReducer,
  productState: productReducer,
  cartState: cartReducer,
});

export default myReducer;
