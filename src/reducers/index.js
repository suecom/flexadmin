import {combineReducers} from 'redux';
import users from './userReducer';
import listings from './listingReducer';

const rootReducer = combineReducers({
  users,
  listings,
})

export default rootReducer;