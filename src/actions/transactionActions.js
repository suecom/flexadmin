import * as types from './actionTypes';
import transactionApi from '../api/transactionApi';

import { loadReviewsSuccess } from './reviewActions';
import { updateReviewsSuccess } from './reviewActions';
import { loadMessagesSuccess } from './messageActions';
import { updateMessagesSuccess } from './messageActions';

export function loadTransactionsSuccess(transactions) {
    return {type: types.LOAD_TRANSACTIONS_SUCCESS, transactions};
}

export function updateTransactionsSuccess(transactions) {
    return {type: types.UPDATE_TRANSACTIONS_SUCCESS, transactions};
}

export function loadTransactions() {
    return function(dispatch) {
        const api = new transactionApi();

        return api.getTransactions(0)
            .then(res => {
                dispatch(loadTransactionsSuccess(res.transactions));
                dispatch(loadReviewsSuccess(res.reviews));
                dispatch(loadMessagesSuccess(res.messages));
            })
            .catch(error => {throw(error)})
    };
}

export function updateTransactions() {
    return function(dispatch) {
        const api = new transactionApi();

        return api.getTransactions(1)
            .then(res => {
                dispatch(updateTransactionsSuccess(res.transactions));
                dispatch(updateReviewsSuccess(res.reviews));
                dispatch(updateMessagesSuccess(res.messages));
            })
            .catch(error => {throw(error)})
    }
}