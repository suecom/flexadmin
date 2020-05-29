import * as types from './actionTypes';
import transactionApi from '../api/transactionApi';

import { loadTransactionsSuccess } from './transactionActions'

export function loadReviewsSuccess(reviews) {
    return {type: types.LOAD_REVIEWS_SUCCESS, reviews};
}

export function loadReviews() {
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