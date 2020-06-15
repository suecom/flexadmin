import * as types from './actionTypes';
import transactionApi from '../api/transactionApi';

import { loadTransactionsSuccess } from './transactionActions';
import { updateTransactionsSuccess } from './transactionActions';
import { loadReviewsSuccess } from './reviewActions';
import { updateReviewsSuccess } from './reviewActions';

export function loadMessagesSuccess(messages) {
    return {type: types.LOAD_MESSAGES_SUCCESS, messages};
}

export function updateMessagesSuccess(messages) {
    return {type: types.UPDATE_MESSAGES_SUCCESS, messages};
}

export function loadReviews() {
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

export function updateReviews() {
    return function(dispatch) {
        const api = new transactionApi();

        return api.getTransactions(1)
            .then(res => {
                dispatch(updateTransactionsSuccess(res.transactions));
                dispatch(updateReviewsSuccess(res.reviews));
                dispatch(updateMessagesSuccess(res.messages));
            })
            .catch(error => {throw(error)})
    };
}