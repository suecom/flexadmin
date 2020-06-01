import * as types from './actionTypes';
import transactionApi from '../api/transactionApi';

import { loadTransactionsSuccess } from './transactionActions';
import { loadReviewsSuccess } from './reviewActions'

export function loadMessagesSuccess(messages) {
    return {type: types.LOAD_MESSAGES_SUCCESS, messages};
}

export function loadReviews() {
    return function(dispatch) {
        const api = new transactionApi();

        return api.getTransactions()
            .then(res => {
                dispatch(loadTransactionsSuccess(res.transactions));
                dispatch(loadReviewsSuccess(res.reviews));
                dispatch(loadMessagesSuccess(res.messages));
            })
            .catch(error => {throw(error)})
    };
}