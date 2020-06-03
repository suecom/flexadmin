import {combineReducers} from 'redux';
import users from './userReducer';
import listings from './listingReducer';
import transactions from './transactionReducer';
import reviews from './reviewReducer';
import messages from './messageReducer';
import images from './imageReducer';

const rootReducer = combineReducers({
  users,
  listings,
  transactions,
  reviews,
  messages,
  images,
})

export default rootReducer;