import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function listingReducer(state = initialState.listings, action) {
    switch(action.type) {
        case types.LOAD_LISTINGS_SUCCESS:
            return action.listings
        default: 
            return state;
    }
}