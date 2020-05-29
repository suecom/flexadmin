import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function transactionReducer(state = initialState.transactions, action) {
    switch(action.type) {
        case types.LOAD_TRANSACTIONS_SUCCESS:
            return action.transactions
        default: 
            return state;
    }
}