import {combineReducers} from 'redux';
import users from './userReducer';
import listings from './listingReducer';
import transactions from './transactionReducer';
import reviews from './reviewReducer';
import messages from './messageReducer';

const rootReducer = combineReducers({
  users,
  listings,
  transactions,
  reviews,
  messages,
})

export default rootReducer;