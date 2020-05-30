import * as types from './actionTypes';
import transactionApi from '../api/transactionApi';

import { loadReviewsSuccess } from './reviewActions'

export function loadTransactionsSuccess(transactions) {
    return {type: types.LOAD_TRANSACTIONS_SUCCESS, transactions};
}

export function loadTransactions() {
    return function(dispatch) {
        const api = new transactionApi();

        return api.getTransactions()
            .then(res => {
                dispatch(loadTransactionsSuccess(res.transactions));
                dispatch(loadReviewsSuccess(res.reviews));
            })
            .catch(error => {throw(error)})
    };
}