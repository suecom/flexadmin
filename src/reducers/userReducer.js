import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function catReducer(state = initialState.users, action) {
    switch(action.type) {
        case types.LOAD_USERS_SUCCESS:
            return action.users
        default: 
            return state;
    }
}