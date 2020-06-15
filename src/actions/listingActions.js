import * as types from './actionTypes';
import listingApi from '../api/listingApi';

import { loadImagesSuccess } from './imageActions';
import { updateImagesSuccess } from './imageActions';

export function loadListingsSuccess(listings) {
    return {type: types.LOAD_LISTINGS_SUCCESS, listings};
}

export function updateListingsSuccess(listings) {
    return {type: types.UPDATE_LISTINGS_SUCCESS, listings};
}

export function loadListings() {
    return function(dispatch) {
        const api = new listingApi();

        return api.getListings(0)
            .then(res => {
                dispatch(loadListingsSuccess(res.listings));
                dispatch(loadImagesSuccess(res.images));
            })
            .catch(error => { throw(error) });
    };
}

export function updateListings() {
    return function(dispatch) {
        const api = new listingApi();

        return api.getListings(1)
            .then(res => {
                dispatch(updateListingsSuccess(res.listings));
                dispatch(updateImagesSuccess(res.images));
            })
            .catch(error => { throw(error) });
    };
}