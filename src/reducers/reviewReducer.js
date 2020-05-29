import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function reviewReducer(state = initialState.reviews, action) {
    switch(action.type) {
        case types.LOAD_REVIEWS_SUCCESS:
            return action.reviews
        default: 
            return state;
    }
}