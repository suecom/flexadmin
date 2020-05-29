import {combineReducers} from 'redux';
import users from './userReducer';
import listings from './listingReducer';
import transactions from './transactionReducer';
import reviews from './reviewReducer';

const rootReducer = combineReducers({
  users,
  listings,
  transactions,
  reviews,
})

export default rootReducer;