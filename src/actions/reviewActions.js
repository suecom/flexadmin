import * as types from './actionTypes';
import transactionApi from '../api/transactionApi';

import { loadTransactionsSuccess } from './transactionActions';
import { updateTransactionsSuccess } from './transactionActions';
import { loadMessagesSuccess } from './messageActions';
import { updateMessagesSuccess } from './messageActions';

export function loadReviewsSuccess(reviews) {
    return {type: types.LOAD_REVIEWS_SUCCESS, reviews};
}

export function updateReviewsSuccess(reviews) {
    return {type: types.UPDATE_REVIEWS_SUCCESS, reviews};
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
        const api = new transactionApi(1);

        return api.getTransactions(1)
            .then(res => {
                dispatch(updateTransactionsSuccess(res.transactions));
                dispatch(updateReviewsSuccess(res.reviews));
                dispatch(updateMessagesSuccess(res.messages));
            })
            .catch(error => {throw(error)})
    };
}